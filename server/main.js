var dbSeed = {
    /*
     * Add to system hierarchy the basic obj types
     * 	objGroupType Contactable contains:
     *    - objType Customer
     *    - objType Employee
     *    - objType Contact
     *  Job:
     *    - objType Direct Hire
     *    - objType Temporary
     */
    seedSystemObjTypes: function () {
        var systemObjTypes = [
            {
                objGroupType: Enums.objGroupType.contactable,
                objName: 'Customer',
                style: {
					icon: 'build',
					color: 'red'
				},
                defaultPersonType: Enums.personType.organization,
                services: ['messages', 'tasks'],
                fields: [{
                    name: 'department',
                    regex: '.',
                    fieldType: Enums.fieldType.string,
                    defaultValue: 'Primary',
                    showInAdd: true
                    }, {
                    name: 'test2',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: false
                }]
            },
            {
                objGroupType: Enums.objGroupType.contactable,
                objName: 'Contact',
                style: {
					icon: 'build',
					color: 'red'
				},
                defaultPersonType: Enums.personType.human,
                services: ['messages', 'tasks'],
                fields: []
            },
            {
                objGroupType: Enums.objGroupType.contactable,
                objName: 'Employee',
                style: {
					icon: 'connection',
					color: 'pink'
				},
                defaultPersonType: Enums.personType.human,
                services: ['messages', 'tasks'],
                fields: [{
                    name: 'test',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                    }, {
                    name: 'test2',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                }]
            },
            {
                objGroupType: Enums.objGroupType.job,
                objName: 'Direct Hire',
                style: {
					icon: 'briefcase',
					color: 'yellow'
				},
                services: ['messages', 'tasks'],
                fields: [{
                    name: 'test',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                    }, {
                    name: 'test2',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                }]
            },
            {
                objGroupType: Enums.objGroupType.job,
                objName: 'Temporary',
                style: {
					icon: 'briefcase',
					color: 'yellow'
				},
                services: ['messages', 'tasks'],
                fields: [{
                    name: 'Type',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                    }, {
                    name: 'test2',
                    regex: '.*',
                    fieldType: Enums.fieldType.string,
                    defaultValue: '',
                    showInAdd: true
                }]
            }
        ];

        _.forEach(systemObjTypes, function (objtype) {
            var objName = ObjTypes.findOne({
                objName: objtype.objName
            });
            if (objName == null) {
                ObjTypes.insert({
                    hierId: ExartuConfig.SystemHierarchyId,
                    objGroupType: objtype.objGroupType,
                    objName: objtype.objName,
                    services: objtype.services,
                    fields: objtype.fields,
                    personType: objtype.defaultPersonType,
                    style: objtype.style
                })
            } else {
                ObjTypes.update({
                    _id: objtype._id
                }, {
                    $set: {
                        services: objtype.services,
                        fields: objtype.fields,
						style: objtype.style
                    }
                })
            }
        });
    },
    seedSystemRelations: function () {
        var systemRelations = [
            {
                name: 'CustomerContacts',
                obj1: 'Contact',
                obj2: 'Customer',
                visibilityOn1: {
                    name: 'customer',
                    collection: 'Contactables',
                    defaultValue: null,
                    cardinality: {
                        min: 0,
                        max: 1
                    },
                },
                visibilityOn2: {
                    name: 'contacts',
                    collection: 'Contactables',
                    defaultValue: [],
                    cardinality: {
                        min: 0,
                        max: Infinity
                    },
                },
                cascadeDelete: false,
            },
            {
                name: 'asd',
                obj1: 'Employee',
                obj2: 'Customer',
                visibilityOn1: {
                    name: 'asdEmp',
                    collection: 'Contactables',
                    defaultValue: null,
                    cardinality: {
                        min: 0,
                        max: 1
                    },
                },
                visibilityOn2: {
                    name: 'asdCus',
                    collection: 'Contactables',
                    defaultValue: null,
                    cardinality: {
                        min: 0,
                        max: 1
                    },
                },
                cascadeDelete: false,
            },
        ];

        _.forEach(systemRelations, function (rel) {
            var oldRel = Relations.findOne({
                name: rel.name
            });
            if (oldRel == null) {
                rel.hierId = ExartuConfig.SystemHierarchyId;
                console.dir(rel);
                Relations.insert(rel);
            } else {
                Relations.update({
                    _id: oldRel._id
                }, {
                    $set: {
                        visibilityOn1: rel.visibilityOn1,
                        visibilityOn2: rel.visibilityOn2,
                        cascadeDelete: rel.cascadeDelete
                    }
                })
            }
        });
    }
}

Meteor.startup(function () {
    /*
     * Seed database
     * Execute all function defined in seedSystemObjTypes
     */
    _.forEach(dbSeed, function (seedFn) {
        seedFn.call();
    });
    var accountsConfig = Accounts.loginServiceConfiguration._collection;
    var googleConfig = accountsConfig.findOne({
        "service": 'google'
    });

    if (!googleConfig) {
        //read the config
        if (!GoogleConfig) {
            console.log('can not config google login, client\'s credential not found');

        } else {
            accountsConfig.insert({
                service: "google",
                clientId: GoogleConfig.clientId,
                secret: GoogleConfig.clientSecret
            });
            console.log('google accounts configured successfully');
        }
    }
});