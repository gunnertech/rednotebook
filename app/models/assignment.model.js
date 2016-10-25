import mongoose from 'mongoose';

let assignmentSchema = new mongoose.Schema({
	completedAt: { type: Date },
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	document: {type: mongoose.Schema.Types.ObjectId, ref: 'Document'}
});

export default mongoose.model('Assignment', assignmentSchema);