import mongoose from 'mongoose';
import Document from './document.model';
import Input from './input.model';
import Promise from 'bluebird';

let sectionSchema = new mongoose.Schema({
	title: { type: String },
	description: { type: String },
	repeatable: { 
		type: Boolean,
		default: false
	},
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'},
	master: {type: mongoose.Schema.Types.ObjectId, ref: 'Section'},
	children: [{type: mongoose.Schema.Types.ObjectId, ref:'Section'}],
	inputs: [{type: mongoose.Schema.Types.ObjectId, ref:'Input'}]
});

sectionSchema.pre('save', function (next) {
	var Section = mongoose.model('Section', sectionSchema);
	(
		this.master 
		? Section.update( {_id: this.master}, { $addToSet: {children: this._id } } )
		: Document.update( {_id: this.document}, { $addToSet: {sections: this._id } } )
	)
	.then(( (documents) => next() ))
	.error(( (err) => next(err) ));
});

sectionSchema.post('save', function (section) {
	if(section.repeatable && section.children.length < 200) {
		var Section = mongoose.model('Section', sectionSchema);
		for(var i=1; i<=200; i++) {
			var newSection = new Section();
			newSection.master = section._id;
			newSection.position = i;
			newSection.title = section.title;
			newSection.description = section.description;

			newSection.save();
		}
	}
});

sectionSchema.pre('remove', function (next) {
	var Section = mongoose.model('Section', sectionSchema);
	(
		this.master 
		? Section.update( {_id: this.master}, { $pullAll: {children: [this._id] } } )
		: Document.update( {_id: this.document}, { $pullAll: {sections: [this._id] } } )
	)
	.then(( (documents) => next() ))
	.error(( (err) => next(err) ));
});

sectionSchema.post('save', function (section) {
	var query = { position: section.position, _id: { $ne: section._id } };
	var Section = mongoose.model('Section', sectionSchema);
	query[(section.master ? 'master' : 'document')] = (section.master || section.document);
	

	Section.find(query)
	.then( function(sections) {
		return Promise.each(sections, function(section) {
			section.position++;
			return section.save();
		})
	})
	.then( (sections) => console.log(sections) )
	.error(( (err) => console.log(err) ));
});

export default mongoose.model('Section', sectionSchema);