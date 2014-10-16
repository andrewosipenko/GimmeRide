isCursor = Match.Where(function(cursor) {
	return (cursor instanceof Mongo.Cursor);
});
