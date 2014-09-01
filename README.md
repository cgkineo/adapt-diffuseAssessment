adapt-diffuseAssessment
================

Dependencies: [adapt-html2img](https://github.com/cgkineo/adapt-html2img)

Multiple, centralized, cross-element (page/article/block) assessments.

Build assessment trees. Output the results for an assessment on any/many pages as a component. Use the public interface to extend.

Example Assessment Tree:
```
COURSE		  PAGE 			  COMPONENT
assessment1 > assessment2	> c-125
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

Diffuse Assessment Public Interface:
```
Adapt.diffuseAssessment.getAssessments(); //will return all assessments
Adapt.diffuseAssessment.getAssessmentById(id); //returns assessment with id ("assessment1" / "assessment2" / etc)
Adapt.diffuseAssessment.getAssessmentsByParentId(id); //will return all assessments at element id ("course" / "c-20" / "a-01" / "b-22" / etc);
Adapt.diffuseAssessment.getAssessmentsByComponentId(id); //will return all assessments listening for component id completion ( c-209 / etc)
Adapt.diffuseAssessment.model;
```


Diffuse Assessment Model:
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

Example assessment:
```
{
	_assessmentModels: {

	},
	_assessments: [],
	_componentModels: {

	},
	_components: [],
	_feedback: {

	},
	_id: "",
	_isComplete: "",
	_parentId: "course",
	_parents: [],
	_possibleScore: 0,
	_score: 0,
	_scoreAsPercent: 0,
	calculateIdComplete(),
	calculateScore(),
	getFeedback(),
	title: "",
}
```
