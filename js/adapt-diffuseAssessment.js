/*
* adapt-diffuseAssessment
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');
	var DAFeedback = require('extensions/adapt-diffuseAssessment/js/diffuseAssessmentFeedback');
	
	var uid = 0;

	var defaultAssessment = {
		
		_assessmentWeight: 1,
		_score: 0,
		_scoreAsPercent: 0,
		_possibleScore: 0,
		_completed: 0,
		_completedAsPercent: 0,
		_possibleCompleted: 0,
		_descendentComponents: 0,
		_completeDescendentComponents: 0,
		_incompleteDescendentComponents: 0,
		_completeComponents: 0,
		_completeAssessments: 0,
		_incompleteComponents: 0,
		_incompleteAssessments: 0,
		_assessmentModels: undefined,
		_parents: undefined,
		_componentModels: undefined,
		_components: undefined,
		_id: undefined,
		_isComplete: false,
		_parentId: undefined,

		calculateScore: function() {
			//If no other incomplete components in assessment
			this._score = 0;
			this._completed = 0;

			if (this._componentModels !== undefined) {
				this._score =_.reduce(this._componentModels.toJSON(), function(sum, item) {
					return sum+=item._score;
				}, this._score);
				this._completed = _.reduce(this._assessmentModels, function(sum, item) {
					return sum+=item._completeComponents;
				}, this._completed);
			}

			if (this._assessmentModels !== undefined) {
				this._score =_.reduce(this._assessmentModels, function(sum, item) {
					return sum+=item._score*item._assessmentWeight;
				}, this._score);
				this._completed = _.reduce(this._assessmentModels, function(sum, item) {
					if (item._descendentComponents === 0) return  sum+=item._completeComponents*item._assessmentWeight;
					else return sum+=item._completeDescendentComponents*item._assessmentWeight;
				}, this._completed);
			}

			this._scoreAsPercent = (100/this._possibleScore) * this._score;
			this._completedAsPercent = (100/this._possibleCompleted) * this._completed;

			return this;
		},

		calculateIsComplete: function() {
			var rtn = false;
			if (this._componentModels !== undefined) {
				var inCompletes = this._componentModels.where({ _isComplete : false });
				this._incompleteComponents = inCompletes.length;
				this._completeComponents = this._components.length - inCompletes.length;
				if (inCompletes.length !== 0) return false;
			}
			if (this._assessmentModels !== undefined) {
				var inCompletes = _.where(this._assessmentModels, { _isComplete : false });
				this._incompleteAssessments = inCompletes.length;
				this._completeAssessments = this._assessments.length - inCompletes.length;
				this._completeDescendentComponents = _.reduce(this._assessmentModels, function(sum, item) {
					if (item._descendentComponents === 0) return  sum+=item._completeComponents;
					else return sum+=item._completeDescendentComponents;
				}, 0);
				this._incompleteDescendentComponents = _.reduce(this._assessmentModels, function(sum, item) {
					if (item._descendentComponents === 0) return sum+=item._incompleteComponents;
					else return sum+=item._incompleteDescendentComponents;
				}, 0);
				if (inCompletes.length !== 0) return false;
			}
			this._isComplete = true;
			return true;
		}
	};


	var diffuseAssessment = new (Backbone.View.extend({
		model: new Backbone.Model(),
		getAssessments: function() {
			return this.model.get("_assessmentsById");
		},
		getAssessmentById: function(id) {
			return this.getAssessments()[id];
		},
		getAssessmentsByParentId: function(parentId) {
			return this.model.get("_assessmentsByParentId")[parentId];
		},
		getAssessmentsByComponentId: function(componentId) {
			return this.model.get("_assessmentsByComponentId")[componentId];
		}
	}));


	Adapt.once("app:dataReady", function() {

		var course = Adapt.course.get("_diffuseAssessment");

		if (course === undefined || course._isEnabled === false) return;

		//Fetch all pages, articles and blocks
		var assets = {};
		assets['pages'] = new Backbone.Collection((new Backbone.Collection(Adapt.contentObjects.models)).where({_type:"page"}));
		assets['articles'] = Adapt.articles.models;
		assets['blocks'] = Adapt.blocks.models;
		
		var assessmentsById = {};
		var assessmentsByParentId = {};

		//Capture/create unique ids of globally defined assessments
		_.each(course._assessments, function(assess, index) {
			assess = _.extend({}, defaultAssessment, assess);
			course._assessments[index] = assess;
			if (assess._id === undefined) asses._id = "global-"+(++uid);
			assess._parentId = "course";
			if (assessmentsByParentId['course'] === undefined) assessmentsByParentId['course'] = {};
			assessmentsById[assess._id] = assess;
			assessmentsByParentId['course'][assess._id] = assess;

		});

		//Filter pages, articles and blocks with an assessment
		_.each(assets, function(assetList, key) {
			assets[key] = assetList.filter(function(mod) {
				if (mod.get("_diffuseAssessment") !== undefined) return true;
				return false;
			});
		});

		//Reference assessments from pages, articles and blocks in the central model
		//Capture/create unique ids
		_.each(assets, function(assetList, key) {
			_.each(assetList, function(asset) {
				var assess = asset.get("_diffuseAssessment");
				assess = _.extend({}, defaultAssessment, assess);
				asset.set("_diffuseAssessment", assess);
				if (assess._isEnabled === false) return;
				if (assess._id === undefined) asses._id = key+"-"+(++uid);
				assess._parentId = asset.get("_id");
				if (assessmentsByParentId[assess._parentId] === undefined) assessmentsByParentId[assess._parentId] = {};
				assessmentsById[assess._id] = assess;
				assessmentsByParentId[assess._parentId][assess._id] = assess;
			});
		});

		//Store indexs in public model
		course._assessmentsById = assessmentsById
		course._assessmentsByParentId = assessmentsByParentId
		course._assets = assets;

		//TODO:Setup randomisation and selection etc

		//Store assessment by their component ids
		//Add componentsById index to assessment
		course._assessmentsByComponentId = {};
		_.each(assessmentsById, function(assess) {
			if (assess._components === undefined) return;
			var componentModels = [];
			_.each(assess._components, function(componentId) {
				if (course._assessmentsByComponentId[componentId] === undefined) course._assessmentsByComponentId[componentId] = {};
				course._assessmentsByComponentId[componentId][assess._id] = assess;
				componentModels.push(Adapt.findById(componentId));
			});
			assess._descendentComponents = 0;
			assess._incompleteComponents = assess._components.length;
			assess._componentModels = new Backbone.Collection(componentModels);
			assess._possibleScore = _.reduce(assess._componentModels.toJSON(), function(sum, item) {
				return sum+=item._questionWeight; // * item question max score
			},0);
			assess._possibleCompleted = assess._components.length;
		});

		//Begin to sort assessments by heirarchy
		var heirarchy = [ {} ];
		var remaining = {};

		//Store children assessments by their ids
		//Link parents and children
		//Capture assessments with no children assessments
		_.each(assessmentsById, function(assess) {
			if (assess._assessments === undefined) {
				heirarchy[0][assess._id] = [];
				return;
			}
			remaining[assess._id] = _.clone(assess._assessments);
			assess._assessmentModels = {};
			_.each(assess._assessments, function(assessmentId) {
				assess._assessmentModels[assessmentId] = assessmentsById[assessmentId];
				if (assessmentsById[assessmentId]['_parents'] == undefined) assessmentsById[assessmentId]['_parents'] = {};
				assessmentsById[assessmentId]['_parents'][assess._id] = assess;
			})
		});	

		//Build dependency heirarchy from assessments with no children assessments
		var level = 0;
		while (_.keys(remaining).length > 0 && level < 100) {
			var toRemove = _.keys(heirarchy[level]);
			heirarchy.push({});
			_.each(remaining, function(item, key) {
				var leftOver = _.difference(item, toRemove);
				remaining[key] = leftOver;
				if (leftOver.length === 0) {
					delete remaining[key];
					heirarchy[level+1][key] = item;
				}
			});
			level++;
		}
		if (level === 100) throw "diffuseAssessment too many levels!"

		//Flatten heirarchy into dependency order array
		var order = [];
		for (var i = 0; i < heirarchy.length; i++) {
			order = order.concat(_.keys(heirarchy[i]));
		}

		//Calculate possible scores of assessment tree
		_.each(order, function(id) {
			var assess = assessmentsById[id];
			if (assess._assessments === undefined) return;
			assess._incompleteAssessments = assess._assessments.length;
			assess._descendentComponents = _.reduce(assess._assessmentModels, function(sum, item) {
				if (item._descendentComponents === 0) return sum+=item._components.length;
				else return sum+=item._descendentComponents;
			}, 0);
			assess._incompleteDescendentComponents = _.reduce(assess._assessmentModels, function(sum, item) {
				if (item._descendentComponents === 0) return sum+=item._incompleteComponents;
				else return sum+=item._incompleteDescendentComponents;
			}, 0);
			assess._possibleScore = _.reduce(assess._assessmentModels, function(sum, item) {
				return sum+=item._possibleScore*item._assessmentWeight;
			},assess._possibleScore);
			assess._possibleCompleted = _.reduce(assess._assessmentModels, function(sum, item) {
				return sum+=item._possibleCompleted*item._assessmentWeight;
			},assess._possibleCompleted);
		});

		course._order = order;



		//Setup public model
		diffuseAssessment.model.set(course);

		Adapt.trigger("diffuseAssessment:initialized", diffuseAssessment);

	});

	Adapt.on("componentView:postRender", function(view) {

		//Setup assessment listeners

		var model = view.model;
		var componentId = model.get("_id");

		var chainIds = [];
		chainIds.push(model.get("_parentId"));
		chainIds.push(Adapt.findById(chainIds[chainIds.length-1]).get("_parentId"));
		chainIds.push(Adapt.findById(chainIds[chainIds.length-1]).get("_parentId"));
		chainIds.push("course");

		var assessments = {};
		_.each(chainIds, function(id) {
			var assess = diffuseAssessment.getAssessmentsByParentId(id);
			if (assess === undefined) return;
			_.extend(assessments, assess);
		});
		
		if (_.keys(assessments).length === 0) return;

		var shouldListen = false;

		_.each(assessments, function(assess, key) {
			if (assess._components === undefined) return;
			if (assess._components.indexOf(componentId) == -1) return;
			shouldListen = true;
		});

		if (!shouldListen) return;

		diffuseAssessment.listenTo(model, "change:_isInteractionsComplete", function(model, change) {
			Adapt.trigger("diffuseAssessment:interactionComplete", model, change);
		});

	});

	Adapt.on("diffuseAssessment:interactionComplete", function(model) {

		//Calculate assessment completion on component interaction

		var id = model.get("_id");

		if (model.get("_correct") == true || model.get("_attemptsLeft") === 0) model.set("_isComplete", true);
		
		var assessments = diffuseAssessment.getAssessmentsByComponentId(id);

		if ( _.values(assessments).length === 0 ) return;

		_.each(assessments, function (assess, key) {

			assess.calculateScore(assess);

			if (!assess.calculateIsComplete(assess)) {
				Adapt.trigger("diffuseAssessment:assessmentCalculate", assess);
				return;
			}

			_.defer(function() { 
				Adapt.trigger("diffuseAssessment:assessmentComplete", assess);
			});

		});

	});

	Adapt.on("diffuseAssessment:assessmentCalculate", function(assessment) {

		//Calculate parent assessment completion on child assessment completion
		var parentAssessments = assessment._parents;

		if (parentAssessments === undefined) return;
		if ( _.values(parentAssessments).length === 0 ) return;

		_.each(parentAssessments, function (assess, key) {

			assess.calculateScore(assess);

			assess.calculateIsComplete(assess);

			Adapt.trigger("diffuseAssessment:assessmentCalculate", assess);

		});

	});

	Adapt.on("diffuseAssessment:assessmentComplete", function(assessment) {

		//Calculate parent assessment completion on child assessment completion
		var parentAssessments = assessment._parents;

		if (parentAssessments === undefined) return;
		if ( _.values(parentAssessments).length === 0 ) return;

		_.each(parentAssessments, function (assess, key) {
			
			assess.calculateScore(assess);

			if (!assess.calculateIsComplete(assess)) {
				Adapt.trigger("diffuseAssessment:assessmentCalculate", assess);
				return;
			}

			Adapt.trigger("diffuseAssessment:assessmentComplete", assess);

		});

	});

	Adapt.on("remove", function() {
		//Stop listening got component interactions
		diffuseAssessment.stopListening();
	})

	//Make diffuse assessment global
	Adapt.diffuseAssessment = diffuseAssessment;

});
