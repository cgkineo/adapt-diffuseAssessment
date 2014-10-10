/*
* adapt-diffuseAssessment
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define(function(require) {
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var HBS = require('extensions/adapt-diffuseAssessment/js/handlebars-v1.3.0');
    
    var DAFeedback = ComponentView.extend({
        events: {
            "click .printbutton": "onPrintClick"
        },

        preRender: function() {
            var thisHandle = this;
            this.$el.on("inview", function() {
                thisHandle.setCompletionStatus();
            })
        },

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

            var _feedback = assessment['_feedback'];
            var feedback = undefined;
            for (var f = 0; f < _feedback.length; f++) {
                var item = _feedback[f];
                if (item._forScoreAsPercent !== undefined && item._forScoreAsPercent._max >= assess._scoreAsPercent && item._forScoreAsPercent._min <= assess._scoreAsPercent ) {
                    feedback = item;
                    break;
                } else if (item._forScore !== undefined && item._forScore._max >= assess._score && feedback._forScore._min <= assess._score ) {
                    feedback = item;
                    break;
                } else if (item._forPoints !== undefined && item._forPoints._max >= assess._currentPoints && item._forPoints._min <= assess._currentPoints ) {
                    feedback = item;
                    break;
                } else if (item._forGroup !== undefined && item._forGroup == assess._currentGroup ) {
                    feedback = item;
                    break;
                }
            }

            if (feedback === undefined) return;

            
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

                    if (assessment._hideUntilComplete) {
                        thisHandle.$el.hide(0);
                        thisHandle.$el.removeClass("display-none");
                        thisHandle.$el.fadeIn(1000);
                    }

                }, function(clone) {
                    if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                    else clone.css("width", thisHandle.$el.parent().width() + "px");
                });
            } else {

                if (assessment._hideUntilComplete) {
                    this.$el.css("display", "none");
                    this.$el.removeClass("display-none");
                    this.$el.fadeIn(assessment._showAnimationDuration || 2000);
                }

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

        },

        onPrintClick: function () {
            var thisHandle = this;
            var model = this.model.get("_diffuseAssessment");

            html2img(this.$el, function(data) {

                Adapt.trigger("printPreview:open", {
                    title: model.printTitle,
                    instructions: model.printInstructions,
                    _rendered: data,
                    postRender: function(settings) {

                        var img = new Image();
                        img.src = settings._rendered;
                        this.$el.html("").append(img);

                    }
                })

            }, function(clone) {
                if (thisHandle.model.get("_layout") !== "full") clone.css("width", thisHandle.$el.parent().width() / 2 + "px");
                else clone.css("width", thisHandle.$el.parent().width() + "px");
            });
        }

    });

    Adapt.register("diffuseAssessmentFeedback", DAFeedback);

    return DAFeedback;
});
