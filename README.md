adapt-diffuseAssessment
================

Extension + Results Component

Results Component Dependencies:  
[adapt-printPreview](https://github.com/cgkineo/adapt-printPreview)  
[adapt-html2img](https://github.com/cgkineo/adapt-html2img)  

Multiple, centralized, cross-element (page/article/block) assessments.

Build assessment trees. Output the results for an assessment on any/many pages as a component. Use the public interface to extend.

###Public Interface:
```
Adapt.diffuseAssessment.getAssessments(); //will return all assessments
Adapt.diffuseAssessment.getAssessmentById(id); //returns assessment with id ("assessment1" / "assessment2" / etc)
Adapt.diffuseAssessment.getAssessmentsByParentId(id); //will return all assessments at element id ("course" / "c-20" / "a-01" / "b-22" / etc);
Adapt.diffuseAssessment.getAssessmentsByComponentId(id); //will return all assessments listening for component id completion ( c-209 / etc)
Adapt.diffuseAssessment.model;
```

##Events:
```
diffuseAssessment:initialized(diffuseAssessmentPublicInterface)
diffuseAssessment:interactionComplete(componentModel)
diffuseAssessment:assessmentCalculate(assessmentModel)
diffuseAssessment:assessmentComplete(assessmentModel)
diffuseAssessment:recalculated
```

###Models

Global Model:
```
{
	_assessments: [],	//directly from course.json
	_assessmentsByComponentId: {	//sorted by component id
		c-125: {
			assessment2: {

			}
		}
	},
	_assessmentsById: { //sorted by assessment id
		assessment1: {

		}
	},
	_assessmentsByParentId: { //sorted by parent element id
		co-45: {
			assessment3: {

			}
		}
	},
	_assets: {
		"articles": [],
		"blocks": [],
		"pages": []
	}
	_isEnabled: true
}
```

Assessment Model:
```
{
	_assessmentModels: [], //children assessments
	_assessmentWeight: 1,
	_assessments: [], //children assessments directly from page/article/block json
	_completeAssessments: 0,
	_completeComponents: 0,
	_completeDescendentComponents: 0,
	_completed: 0, //total completion (adjusted by _assessmentWeight)
	_completedAsPercent: 0, //percentage completed  (adjusted by _assessmentWeight)
	_componentModels: [], //children components
	_components: [], //components directly from page/article/block json
	_descendentComponentModels: [] //all descendent component models
	_descendentComponents: 0
	_id: "", //assessment id directly from page/article/block json	
	_incompleteAssessments: 0,
	_incompleteComponents: 0,
	_incompleteDescendentComponents: 0,
	_isComplete: false,
	_parentId: "course", //element (page/article/block) id
	_parents: [], //parent assessments
	_possibleCompleted: 0, //total possible completion
	_possibleScore: 0, //total possible score
	_score: 0, //total score (adjusted by _assessmentWeight)
	_scoreAsPercent: 0, //percentage score  (adjusted by _assessmentWeight)

	calculateIsComplete(), //function to set _isComplete
	calculateScore() //function to set _score and _scoreAsPercent
}
```

###Configuration
To setup a simple assessment tree across two pages and four components, where the totals results are required use:
```
"_diffuseAssessment": {
    "_isEnabled": true,
    "_assessments": [
        {
            "_id": "total",
            "_assessments": [ "page1", "page2" ]
        },
        {
            "_id": "page1",
            "_components": [ "c-70", "c-80" ]
        },
        {
            "_id": "page2",
            "_components": [ "c-90", "c-100" ]
        }
    ]
}
```

Please see example.json

###Points + Score Grouping
It is possible to use the feedback component with a point/grouping system instead of score percentages.  
  
####Example Grouping Systems - 5 MCQS, SCORES 1-3, 6 GROUPINGS, 6 FEEDBACKS:
NOTE! To use grouping an ammended mcq component is required, this is so that it can have multiple correct scores and scores bigger than 1. (2014-10-07 OLLIE: These changes are in the process of being pushed to open source);
```
//to go in course.json
"_diffuseAssessment": {
    "_isEnabled": true,
    "_assessments": [ 
        {
            "_id": "co-10-assessment",
            "_components": [ 
                "c-65", "c-70", "c-75", "c-80", "c-85"
            ],
            "_grouping": [
                {
                    "_whereItemScoresOccur": {
                        "1": { "_min": 3, "_max": 5 }
                    },
                    "_group": "1"
                },
                {
                    "_whereItemScoresOccur": {
                        "2": { "_min": 3, "_max": 5 }
                    },
                    "_group": "2"
                },
                {
                    "_whereItemScoresOccur": {
                        "3": { "_min": 3, "_max": 5 }
                    },
                    "_group": "3"
                },
                {
                    "_whereItemScoresOccur": {
                        "1": { "_min": 2, "_max": 2 },
                        "2": { "_min": 2, "_max": 2 }
                    },
                    "_group": "1,2"
                },
                {
                    "_whereItemScoresOccur": {
                        "1": { "_min": 2, "_max": 2 },
                        "3": { "_min": 2, "_max": 2 }
                    },
                    "_group": "1,3"
                },
                {
                    "_whereItemScoresOccur": {
                        "2": { "_min": 2, "_max": 2 },
                        "3": { "_min": 2, "_max": 2 }
                    },
                    "_group": "2,3"
                },
                {
                    "_whereItemScoresOccur": {
                    },
                    "_group": "incomplete"
                }
            ]
        }
    ]
}


//to go in components.json
//MCQ COMPONENT 1: c-65
{
	"_id":"c-65",
	"_parentId":"b-45",
	"_type":"component",
	"_component":"mcq",
	"_classes":"",
	"_layout":"full",
	"_attempts":1,
	"_questionWeight":1,
	"_isRandom":false,
	"_selectable":1,
	"_canShowFeedback": false,
	"_useItemScores": true,
	"title": "MCQ 1/5",
	"displayTitle": "MCQ 1/5",
	"body": "Which of the following options would you consider to be correct?",
	"instruction": "",
	"_items": [
		{
			"text": "Group 1.",
			"_shouldBeSelected":true,
			"_score": 1
		},
		{
			"text": "Group 2.",
			"_shouldBeSelected":true,
			"_score": 2
		},
		{
			"text": "Group 3.",
			"_shouldBeSelected":true,
			"_score": 3
		}
	],
	"_feedback": {
		"_correct": "",
		"_incorrect": {
			"notFinal": "",
			"final": ""
		},
		"_partlyCorrect": {
			"notFinal": "",
			"final": ""
		}
	},
	"_buttons":{
		"submit":"",
		"reset":"",
		"showCorrectAnswer":"",
		"hideCorrectAnswer":""
	},
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},
//MCQ COMPONENT 2: c-70
{
	"_id":"c-70",
	"_parentId":"b-50",
	"_type":"component",
	"_component":"mcq",
	"_classes":"",
	"_layout":"full",
	"_attempts":1,
	"_questionWeight":1,
	"_isRandom":false,
	"_selectable":1,
	"_canShowFeedback": false,
	"_useItemScores": true,
	"title": "MCQ 2/5",
	"displayTitle": "MCQ 2/5",
	"body": "Which of the following options would you consider to be correct?",
	"instruction": "",
	"_items": [
		{
			"text": "Group 3.",
			"_shouldBeSelected":true,
			"_score": 3
		},
		{
			"text": "Group 2.",
			"_shouldBeSelected":true,
			"_score": 2
		},
		{
			"text": "Group 1.",
			"_shouldBeSelected":true,
			"_score": 1
		}
	],
	"_feedback": {
		"_correct": "",
		"_incorrect": {
			"notFinal": "",
			"final": ""
		},
		"_partlyCorrect": {
			"notFinal": "",
			"final": ""
		}
	},
	"_buttons":{
		"submit":"",
		"reset":"",
		"showCorrectAnswer":"",
		"hideCorrectAnswer":""
	},
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},
//MCQ COMPONENT 3: c-75
{
	"_id":"c-75",
	"_parentId":"b-55",
	"_type":"component",
	"_component":"mcq",
	"_classes":"",
	"_layout":"full",
	"_attempts":1,
	"_questionWeight":1,
	"_isRandom":false,
	"_selectable":1,
	"_canShowFeedback": false,
	"_useItemScores": true,
	"title": "MCQ 3/5",
	"displayTitle": "MCQ 3/5",
	"body": "Which of the following options would you consider to be correct?",
	"instruction": "",
	"_items": [
		{
			"text": "Group 2.",
			"_shouldBeSelected":true,
			"_score": 2
		},
		{
			"text": "Group 1.",
			"_shouldBeSelected":true,
			"_score": 1
		},
		{
			"text": "Group 3.",
			"_shouldBeSelected":true,
			"_score": 3
		}
	],
	"_feedback": {
		"_correct": "",
		"_incorrect": {
			"notFinal": "",
			"final": ""
		},
		"_partlyCorrect": {
			"notFinal": "",
			"final": ""
		}
	},
	"_buttons":{
		"submit":"",
		"reset":"",
		"showCorrectAnswer":"",
		"hideCorrectAnswer":""
	},
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},
//MCQ COMPONENT 4: c-80
{
	"_id":"c-80",
	"_parentId":"b-60",
	"_type":"component",
	"_component":"mcq",
	"_classes":"",
	"_layout":"full",
	"_attempts":1,
	"_questionWeight":1,
	"_isRandom":false,
	"_selectable":1,
	"_canShowFeedback": false,
	"_useItemScores": true,
	"title": "MCQ 4/5",
	"displayTitle": "MCQ 4/5",
	"body": "Which of the following options would you consider to be correct?",
	"instruction": "",
	"_items": [
		{
			"text": "Gruop 2.",
			"_shouldBeSelected":true,
			"_score": 2
		},
		{
			"text": "Group 3.",
			"_shouldBeSelected":true,
			"_score": 3
		},
		{
			"text": "Group 1.",
			"_shouldBeSelected":true,
			"_score": 1
		}
	],
	"_feedback": {
		"_correct": "",
		"_incorrect": {
			"notFinal": "",
			"final": ""
		},
		"_partlyCorrect": {
			"notFinal": "",
			"final": ""
		}
	},
	"_buttons":{
		"submit":"",
		"reset":"",
		"showCorrectAnswer":"",
		"hideCorrectAnswer":""
	},
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},
//MCQ COMPONENT 5: c-85
{
	"_id":"c-85",
	"_parentId":"b-65",
	"_type":"component",
	"_component":"mcq",
	"_classes":"",
	"_layout":"full",
	"_attempts":1,
	"_questionWeight":1,
	"_isRandom":false,
	"_selectable":1,
	"_canShowFeedback": false,
	"_useItemScores": true,
	"title": "MCQ 5/5",
	"displayTitle": "MCQ 5/5",
	"body": "Which of the following options would you consider to be correct?",
	"instruction": "",
	"_items": [
		{
			"text": "Group 3.",
			"_shouldBeSelected":true,
			"_score": 3
		},
		{
			"text": "Group 1.",
			"_shouldBeSelected":true,
			"_score": 1
		},
		{
			"text": "Group 2.",
			"_shouldBeSelected":true,
			"_score": 2
		}
	],
	"_feedback": {
		"_correct": "",
		"_incorrect": {
			"notFinal": "",
			"final": ""
		},
		"_partlyCorrect": {
			"notFinal": "",
			"final": ""
		}
	},
	"_buttons":{
		"submit":"",
		"reset":"",
		"showCorrectAnswer":"",
		"hideCorrectAnswer":""
	},
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},
//RESULTS COMPONENT
{
    "_id": "c-95",
    "_parentId": "b-70",
    "_type": "component",
    "_component": "diffuseAssessmentFeedback",
    "_classes": "display-none",
    "_layout": "full",
    "title": " ",
    "displayTitle": " ",
    "body": " ",
    "instruction": "",
    "_diffuseAssessment": {
    	"_hideUntilComplete": true,
    	"_showAnimationDuration": 1000,
        "_assessmentId": "co-10-assessment",
        "_isResetOnRevisit": true,
        "_isDisplayAsImage": false,
        "_isPrintable": false,
        "printButtonText": "Print/Save",
        "printTitle": "Results",
        "printInstructions": "Select the image to save or print",
        "_feedback": [
            {
                "_forGroup": "incomplete",
                "title": "Incomplete Title",
                "body": "Incomplete body"
            },
            {
                "_forGroup": "1",
                "title": "Group 1 Title",
                "body": "Group 1 body"
            },
            {
                "_forGroup": "2",
                "title": "Group 2 Title",
                "body": "Group 2 body"
            },
            {
                "_forGroup": "3",
                "title": "Group 3 Title",
                "body": "Group 3 body"
            },
            {
                "_forGroup": "1,2",
                "title": "Group 1,2 Title",
                "body": "Group 1,2 body"
            },
            {
                "_forGroup": "1,3",
                "title": "Group 1,3 Title",
                "body": "Group 1,3 body"
            },
            {
                "_forGroup": "2,3",
                "title": "Group 2,3 Title",
                "body": "Group 2,3 body"
            }
        ]
    },
    "_pageLevelProgress": {
        "_isEnabled": false
    }
},

```


####Example Points Systems - 5 MCQS, SCORES 1-3, 6 GROUPINGS, 6 FEEDBACKS:
NOTE! To use grouping an ammended mcq component is required, this is so that it can have multiple correct scores and scores bigger than 1. (2014-10-07 OLLIE: These changes are in the process of being pushed to open source);
```
//to go in course.json
"_diffuseAssessment": {
    "_isEnabled": true,
    "_assessments": [
        {
            "_id": "finalPage",
            "_components": [
                "c-85",
                "c-87"
            ],
            "_points": [
                {
                    "_forAttemptsToCorrect": {
                        "_min": 1,
                        "_max": 1
                    },
                    "_points": 2
                },
                {
                    "_forAttemptsToCorrect": {
                        "_min": 2,
                        "_max": 100000
                    },
                    "_points": 1
                }
            ]
        }
    ]
},


//to go in components.json
//MCQ COMPONENT 1: c-85
{
    "_id": "c-85",
    "_parentId": "b-65",
    "_type": "component",
    "_component": "consequenceMcq",
    "_classes": "",
    "_layout": "full",
    "_attempts": 2,
    "_questionWeight": 1,
    "_isRandom": false,
    "_selectable": 1,
    "_shouldAutoReset": true,
    "title": "MCQ",
    "displayTitle": "MCQ",
    "body": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed.",
    "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "_items": [
        {
            "text": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed. (correct)",
            "_shouldBeSelected": true,
            "feedbackImage": "course/en/images/feedback_icon_1.png",
            "feedback": "Feedback"
        },
        {
            "text": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed. (incorrect)",
            "_shouldBeSelected": false,
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": {
                "final": "Final",
                "notFinal": "Not Final"
            }
        },
        {
            "text": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed. (incorrect)",
            "_shouldBeSelected": false,
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": {
                "final": "Final",
                "notFinal": "Not Final"
            }
        },
        {
            "text": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed. (incorrect)",
            "_shouldBeSelected": false,
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": {
                "final": "Final",
                "notFinal": "Not Final"
            }
        }
    ],
    "_feedback": {
        "correct":"<i>Select X to close this window and move on to the next decision point.</i>",
        "_incorrect": {
            "notFinal": "<i>Select X to try the question again. Read the ‘Top tips’ if you need help.</i>",
            "final": "<i>Select X to close this window and read the ‘Top tips’ before you move on to the next decision point.</i>"
        },
        "_partlyCorrect": {
            "notFinal": "",
            "final": ""
        }
    },
    "_pageLevelProgress": {
        "_isEnabled": true
    }
}

//MCQ COMPONENT 1: c-87
{
    "_id": "c-87",
    "_parentId": "b-75",
    "_type": "component",
    "_component": "consequenceMcq",
    "_classes": "",
    "_layout": "full",
    "_attempts": 2,
    "_questionWeight": 1,
    "_isRandom": false,
    "_selectable": 1,
    "_shouldAutoReset": true,
    "title": "MCQ",
    "displayTitle": "MCQ",
    "body": "Duis et mauris lacus. Etiam eu quam ut nibh scelerisque efficitur et in velit. Aliquam quis libero vitae eros vestibulum dictum. Suspendisse tristique convallis dui, eget bibendum massa euismod sed.",
    "instruction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "_items": [
        {
            "text": "MCQ option 1 (correct)",
            "_shouldBeSelected": true,
            "questionStem": "Stem",
            "feedbackImage": "course/en/images/feedback_icon_1.png",
            "feedback": "Feedback"
        },
        {
            "text": "MCQ option 2 (incorrect)",
            "_shouldBeSelected": false,
            "questionStem": "Stem",
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": "Feedback"
        },
        {
            "text": "MCQ option 3 (incorrect)",
            "_shouldBeSelected": false,
            "questionStem": "Stem",
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": "Feedback"
        },
        {
            "text": "MCQ option 4 (incorrect)",
            "_shouldBeSelected": false,
            "questionStem": "Stem",
            "feedbackImage": "course/en/images/feedback_icon_2.png",
            "feedback": "Feedback"
        }
    ],
    "_feedback": {
        "correct":"<i>Select X to close this window and move on to the next decision point.</i>",
        "_incorrect": {
            "notFinal": "<i>Select X to try the question again. Read the ‘Top tips’ if you need help.</i>",
            "final": "<i>Select X to close this window and read the ‘Top tips’ before you move on to the next decision point.</i>"
        },
        "_partlyCorrect": {
            "notFinal": "",
            "final": ""
        }
    },
    "_pageLevelProgress": {
        "_isEnabled": true
    }
},

//RESULTS COMPONENT
 {
    "_id": "c-110",
    "_parentId": "b-80",
    "_type": "component",
    "_type": "component",
    "_component": "diffuseAssessmentFeedback",
    "_classes": "",
    "_layout": "left",
    "title": " ",
    "displayTitle": " ",
    "body": " ",
    "instruction": "",
    "_diffuseAssessment": {
        "_assessmentId": "finalPage",
        "_isResetOnRevisit": true,
        "_isDisplayAsImage": false,
        "_isPrintable": false,
        "printButtonText": "Print/Save",
        "printTitle": "Results",
        "printInstructions": "Select the image to save or print",
        "_feedback": [
            {
                "_forPoints": {
                    "_min": 0,
                    "_max": 0
                },
                "title": "{{_currentPoints}} points! :(",
                "body": "You scored {{_currentPoints}} points."
            },
            {
                "_forPoints": {
                    "_min": 1,
                    "_max": 1
                },
                "title": "{{_currentPoints}} point. Well done!",
                "body": "You scored {{_currentPoints}} point."
            },
            {
                "_forPoints": {
                    "_min": 2,
                    "_max": 2
                },
                "title": "{{_currentPoints}} points. Well done!",
                "body": "Good job on completing this question! You scored {{_currentPoints}} points."
            },
            {
                "_forPoints": {
                    "_min": 3,
                    "_max": 3
                },
                "title": "{{_currentPoints}} points. Well done!",
                "body": "Good job on completing this question! You scored {{_currentPoints}} points."
            },
            {
                "_forPoints": {
                    "_min": 4,
                    "_max": 4
                },
                "title": "{{_currentPoints}} points. Well done!",
                "body": "Good job on completing this question! You scored {{_currentPoints}} points."
            }
        ]
    },
    "_pageLevelProgress": {
        "_isEnabled": false
    },
    "_strickle": {
        "_isEnabled": false
    }
},

```