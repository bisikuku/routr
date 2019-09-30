/**
 * @author Pedro Sanders
 * @since v1
 *
 * Unit Test for the "NHT"
 */
const assert = require('assert')
const NHTServer = Java.type('io.routr.nht.NHTServer')
const NHTClient = Java.type('io.routr.nht.NHTClient')
const HashMap = Java.type('java.util.HashMap')

/*
 * KNOWN ISSUES:
 * 1. There is a bug that I can't reproduce here, where the NHTClient
 * gets a "java.rmi.NoSuchObjectException". This happens when the broker is is
 * yet available.
 *
 * 2. Another issue is that I dont have a way to setup a timeout for requests
 * to the NHTClient, which could cause the server to hangup watting for a
 * response that will never come.
 */
describe('Network Hashtable', () => {
    let nht
    let nhtServer
    const hasmap = new HashMap()

    before(() => {
        nhtServer = new NHTServer("vm://routr")
        nhtServer.start()
        nht = new NHTClient("vm://routr")
    })

    after(() => nhtServer.stop())

    it.skip('Connection retry', function(done) {
        new NHTClient("vm://routr").put('test', 'test')
        done()
    })

    it('Adding new (key,value) pair with collection', function(done) {
        assert.equal(nht.withCollection('test').put('test', 'test'), null)
        done()
    })

    it('Adding new (key,value) pair', function(done) {
        assert.equal(nht.put('test', 'test'), null)
        done()
    })

    it('Listing values in the hastable', function(done) {
        nht.put('test', 'test')
        assert.ok(nht.values().length > 0)
        done()
    })

    // Be aware that in the current implemetation the object you send might not be the same you get
    // because of the serialization process.
    it('Getting value from table', function(done) {
        const body = { test: 'test'}
        nht.put('test', body)
        assert.equal(body.test, nht.get('test').get('test'))
        done()
    })

    it('Removing key', function(done) {
        nht.put('test', 'test')
        assert.equal(nht.remove('test'), 'test')
        done()
    })

    it.skip('Adding thousands of values normal hashmap', function(done) {
        for (let i = 0; i < 10000; i++) {
            const value = 'v' + i
            hasmap.put(value, value)
        }
        done()
    })

    it.skip('Adding thousands of values', function(done) {
        this.timeout(4000);
        for (let i = 0; i < 10000; i++) {
            const value = 'v' + i
            nht.put(value, value)
        }
        done()
    })
})
