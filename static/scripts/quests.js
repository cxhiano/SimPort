function Quest(args) {
    this.boxes = args.boxes;
    this.operation = args.operation;
    this.status = 'pending';
    this.side = args.side;
    this.token = args.token;
    this.startAt = new Date();
    Quest.pendingQuests[this.token] = this;
    args.boxes.forEach(function(box) {
        Quest.pendingBoxDict[box] = this;
    });
}

Quest.activatedBoxDict = {};

Quest.pendingBoxDict = {};

Quest.pendingQuests = {};

Quest.activatedQuests = {};

Quest.prototype = {
    activate: function() {
        this.status = 'active';
        delete Quest.pendingQuests[this.token];
        Quest.activatedQuests[this.token] = this;
        args.boxes.forEach(function(box) {
            delete Quest.pendingBoxDict[box];
            Quest.activatedBoxDict[box] = this;
        });
    },
};
