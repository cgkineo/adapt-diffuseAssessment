adapt-diffuseAssessment
================

Extension + Results Component

Results Component Dependencies:  
[adapt-printPreview](https://github.com/cgkineo/adapt-printPreview)  
[adapt-html2img](https://github.com/cgkineo/adapt-html2img)  

Multiple, centralized, cross-element (page/article/block) assessments.

Build assessment trees. Output the results for an assessment on any/many pages as a component. Use the public interface to extend.

Example Assessment Tree:
```
COURSE		  PAGE 			  COMPONENT
assessment1 > assessment2		> c-125
							> c-126
							> c-127
							> c-128
							.
							.
							.

			> assessment3	> c-209
							> c-210
							> c-211
							> c-212
							.
							.
							.
			.
			.
			.
.
.
.

```

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
		},
		c-126: {
			assessment2: {
			
			}
		},
		c-127: {
			assessment2: {
			
			}
		},
		c-128: {
			assessment2: {
			
			}
		},
		c-209: {
			assessment3: {

			}
		},
		c-210: {
			assessment3: {
			
			}
		},
		c-211: {
			assessment3: {
			
			}
		},
		c-212: {
			assessment3: {
			
			}
		}
	},
	_assessmentsById: { //sorted by assessment id
		assessment1: {

		},
		assessment2: {

		},
		assessment3: {

		}
	},
	_assessmentsByParentId: { //sorted by parent element id
		co-45: {
			assessment3: {

			},
			assessment2: {

			}
		},
		course: {
			assessment1: {

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
	_assessmentModels: { //children assessments

	},
	_assessments: [], //children assessments directly from page/article/block json
	_componentModels: { //children components

	},
	_components: [], //components directly from page/article/block json
	_id: "", //assessment id directly from page/article/block json
	_completeComponents: 0,
	_completeAssessments: 0,
	_incompleteComponents: 0,
	_incompleteAssessments: 0,
	_isComplete: false,
	_parentId: "course", //element (page/article/block) id
	_parents: [], //parent assessments
	_assessmentWeight: 1,
	_possibleScore: 0, //total possible score
	_possibleCompleted: 0, //total possible completion
	_score: 0, //total score at completion  (adjusted by _assessmentWeight)
	_scoreAsPercent: 0, //percentage score  (adjusted by _assessmentWeight)
	_completed: 0, //total completion (adjusted by _assessmentWeight)
	_completedAsPercent: 0, //percentage completed  (adjusted by _assessmentWeight)

	calculateIsComplete(), //function to set _isComplete
	calculateScore() //function to set _score and _scoreAsPercent
}
```

###Configuration

Please see example.json
