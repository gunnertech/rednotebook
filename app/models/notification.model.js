import mongoose from 'mongoose';

let notificationSchema = new mongoose.Schema({
	seenAt: { type: Date },
	openedAt: { type: Date },
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	message: String,
	data: Object
});

export default mongoose.model('Notification', notificationSchema);