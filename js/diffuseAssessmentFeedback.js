/*
 * adapt-diffuseAssessmentFeedback
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Oliver Foster <oliver.foster@kineo.com>
 */
define(function(require) {
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var HBS = require('extensions/adapt-diffuseAssessment/js/handlebars-v1.3.0');
    
    var DAFeedback = ComponentView.extend({

    	postRender: function() {

            this.$el.addClass("not-complete");

            this.listenTo(Adapt, "diffuseAssessment:assessmentComplete", this.assessmentComplete);
            this.listenTo(Adapt, "device:resize device:change", this.resize);
            this.listenTo(Adapt, "remove", this.remove);
    		this.setReadyStatus();

            var model = this.model.get("_diffuseAssessment");
            var assess = model._assessmentId;
            if (assess === undefined) return;

            if (model._isDisplayAsImage) this.$el.addClass("is-displayasimage");
            else this.$el.addClass("not-displayasimage");

            var assessment = Adapt.diffuseAssessment.getAssessmentById(assess);

            if (!model._isResetOnRevisit && assessment._isComplete) this.assessmentComplete(assessment);

    	},
    	
        assessmentComplete: function(assess) {
            this.setCompletionStatus();

            var assessment = this.model.get("_diffuseAssessment");
            if (assess._id != assessment._assessmentId) return;

            var feedback = Adapt.diffuseAssessment.getAssessmentById(assessment._assessmentId).getFeedback(assessment['_feedback']);
            
            this.$el.find(".component-title-inner").html(HBS.compile(feedback.title)(assess));
            this.$el.find(".component-body-inner").html(HBS.compile(feedback.body)(assess));

            var thisHandle = this;
            this.$el.removeClass("not-complete");
            this.$el.addClass("is-complete");

            var model = this.model.get("_diffuseAssessment");

            if (model._isDisplayAsImage) {

                html2img(this.$el, function(data) {

                    var img = new Image();
                    img.src = data;
                    $(img).css("cursor", "pointer").attr("id","outputimg");

                    thisHandle.$el.children("#outputimg").remove();
                    thisHandle.$el.append(img);

                }, function(clone) {
                    if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                    else clone.css("width", thisHandle.$el.parent().width() + "px");
                });
            }

        },

        resize: function() {
            if (!this.$el.hasClass("is-complete")) return;
            var model = this.model.get("_diffuseAssessment");
            if (!model._isDisplayAsImage) return;

            var thisHandle = this;
            thisHandle.$el.children("#outputimg").remove();

            html2img(this.$el, function(data) {

                var img = new Image();
                img.src = data;
                $(img).css("cursor", "pointer").attr("id","outputimg");

                thisHandle.$el.append(img);

            }, function(clone) {
                if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                else clone.css("width", thisHandle.$el.parent().width() + "px");
            });

        }

    });

    Adapt.register("diffuseAssessmentFeedback", DAFeedback);

    return DAFeedback;
});
