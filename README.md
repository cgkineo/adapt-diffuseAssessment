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
