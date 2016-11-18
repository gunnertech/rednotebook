import mongoose from 'mongoose';

let documentSchema = new mongoose.Schema({
	title: { type: String },
	position: {
		type: Number,
		required: true,
		get: v => Math.round(v),
		set: v => Math.round(v)
	},
	part: {type: mongoose.Schema.Types.ObjectId, ref: 'Part'},
	sections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
	state: {type: mongoose.Schema.Types.ObjectId, ref:'State'},
	isOngoing: {
		type: Boolean,
		required: true,
		default: false
	},
  assignments: [{type: mongoose.Schema.Types.ObjectId, ref:'Assignment'}]
});

export default mongoose.model('Document', documentSchema);