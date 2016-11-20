import mongoose from 'mongoose';
import Response from './response.model';
import Section from './section.model';
import Promise from 'bluebird';

let inputSchema = new mongoose.Schema({
	label: { type: String },
	placeholder: { type: String },
	description: { type: String },
	dataType: { 
		type: String,
		enum: ["File", "Short Text", "Number", "Percentage", "Long Text", "Date"]
	},
	choices: {
		type: [String]
	},
	documentUrl: { type: String },
	allowMultipleChoiceSelections: {
		type: Boolean,
		required: true,
		default: false
	},
	repeatable: {
		type: Boolean,
		required: true,
		default: false
	},
	requiresEncryption: {
		type: Boolean,
		required: true,
		default: false
	},
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	section: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
	master: {type: mongoose.Schema.Types.ObjectId, ref: 'Input'},
	children: [{type: mongoose.Schema.Types.ObjectId, ref:'Input'}],
	responses: [{type: mongoose.Schema.Types.ObjectId, ref:'Response'}]
});


inputSchema.pre('save', function (next) {
	var Input = mongoose.model('Input', inputSchema);
	(
		this.master 
		? Input.update( {_id: this.master}, { $addToSet: {children: this._id } } )
		: Section.update( {_id: this.section}, { $addToSet: {inputs: this._id } } )
	)
	.then(( (sections) => next() ))
	.error(( (err) => next(err) ));
});

inputSchema.post('save', function (input) {
	if(input.repeatable && input.children.length < 200) {
		var Input = mongoose.model('Input', inputSchema);
		for(var i=1; i<=200; i++) {
			var newInput = new Input();
			newInput.master = input._id;
			newInput.position = i;
			newInput.requiresEncryption = input.requiresEncryption;
			newInput.label = input.label;
			newInput.description = input.description;
			newInput.dataType = input.dataType;
			newInput.choices = input.choices;
			newInput.documentUrl = input.documentUrl;
			newInput.allowMultipleChoiceSelections = input.allowMultipleChoiceSelections;

			newInput.save();
		}
	}
});

inputSchema.pre('remove', function (next) {
	var Input = mongoose.model('Input', inputSchema);
	(
		this.master 
		? Input.update( {_id: this.master}, { $pullAll: {children: [this._id] } } )
		: Section.update( {_id: this.section}, { $pullAll: {inputs: [this._id] } } )
	)
	.then(( (sections) => next() ))
	.error(( (err) => next(err) ));
});

inputSchema.post('save', function (input) {
	var query = { position: input.position, _id: { $ne: input._id } };
	var Input = mongoose.model('Input', inputSchema);
	query[(input.master ? 'master' : 'section')] = (input.master || input.section);
	


	Input.find(query)
	.then( function(inputs) {
		return Promise.each(inputs, function(input) {
			input.position++;
			return input.save();
		})
	})
	.then( (inputs) => console.log(inputs) )
	.error(( (err) => console.log(err) ));
});

export default mongoose.model('Input', inputSchema);