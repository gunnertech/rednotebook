import mongoose from 'mongoose';

let responseSchema = new mongoose.Schema({
	value: { type: String },
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	input: {type: mongoose.Schema.Types.ObjectId, ref: 'Input'}
});

export default mongoose.model('Response', responseSchema);