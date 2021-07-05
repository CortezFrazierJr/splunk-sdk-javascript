var splunkjs = require('../../index');
var Async = splunkjs.Async;
var assert = require("assert");

module.exports = function (svc) {
    return {
        beforeEach: function (done) {
            this.service = svc;
            done();
        },

        "Callback#List views": function (done) {
            var service = this.service;

            service.views({ owner: "admin", app: "search" }).fetch(function (err, views) {
                assert.ok(!err);
                assert.ok(views);

                var viewsList = views.list();
                assert.ok(viewsList);
                assert.ok(viewsList.length > 0);

                for (var i = 0; i < viewsList.length; i++) {
                    assert.ok(viewsList[i]);
                }

                done();
            });
        },

        "Callback#Create + update + delete view": function (done) {
            var service = this.service;
            var name = "jssdk_testview";
            var originalData = "<view/>";
            var newData = "<view isVisible='false'></view>";

            Async.chain([
                function (done) {
                    service.views({ owner: "admin", app: "sdk-app-collection" }).create({ name: name, "eai:data": originalData }, done);
                },
                function (view, done) {
                    assert.ok(view);

                    assert.strictEqual(view.name, name);
                    assert.strictEqual(view.properties()["eai:data"], originalData);

                    view.update({ "eai:data": newData }, done);
                },
                function (view, done) {
                    assert.ok(view);
                    assert.strictEqual(view.properties()["eai:data"], newData);

                    view.remove(done);
                }
            ],
                function (err) {
                    assert.ok(!err);
                    done();
                }
            );
        }
    };
};