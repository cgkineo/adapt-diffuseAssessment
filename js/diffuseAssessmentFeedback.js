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

            this.listenTo(Adapt, "diffuseAssessment:assessmentComplete", this.assessmentComplete);
            this.listenTo(Adapt, "device:resize device:change", this.resize);
            this.listenTo(Adapt, "remove", this.remove);
    		this.setReadyStatus();

            var assessment = this.model.get("_assessment");
            var assess = Adapt.diffuseAssessment.getAssessmentById(assessment);

            var thisHandle = this;

    	},
    	
        assessmentComplete: function(assess) {
            this.setCompletionStatus();

            var assessment = this.model.get("_assessment");
            if (assess._id != assessment) return;

            var feedback = Adapt.diffuseAssessment.getAssessmentById(assessment).getFeedback();
            
            this.$el.find(".component-title-inner").html(HBS.compile(feedback.title)(assess));
            this.$el.find(".component-body-inner").html(HBS.compile(feedback.body)(assess));

            var thisHandle = this;
            this.$el.addClass("complete");

            html2img(this.$el, function(data) {

                var img = new Image();
                img.src = data;
                $(img).css("cursor", "pointer").attr("id","outputimg");

                thisHandle.$el.children("#outputimg").remove();
                thisHandle.$el.append(img);

            }, function(clone) {
                clone.css("width", thisHandle.$el.parent().width() + "px");
            });

        },

        resize: function() {
            if (!this.$el.hasClass("complete")) return;

            var thisHandle = this;
            thisHandle.$el.children("#outputimg").remove();

            html2img(this.$el, function(data) {

                var img = new Image();
                img.src = data;
                $(img).css("cursor", "pointer").attr("id","outputimg");

                thisHandle.$el.append(img);

            }, function(clone) {
                clone.css("width", thisHandle.$el.parent().width() + "px");
            });

        }

    });

    Adapt.register("diffuseAssessmentFeedback", DAFeedback);

    return DAFeedback;
});
