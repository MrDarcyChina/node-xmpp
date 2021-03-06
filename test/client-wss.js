'use strict'

const test = require('ava')
const xmpp = require('../packages/client')
const debug = require('../packages/debug')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

test.cb('client wss://', t => {
  t.plan(7)

  const entity = new xmpp.Client()
  debug(entity)

  entity.on('connect', () => {
    t.pass()
  })

  entity.once('open', (el) => {
    t.true(el instanceof xmpp.xml.Element)
  })

  entity.on('authenticate', auth => {
    t.is(typeof auth, 'function')
    auth('node-xmpp', 'foobar')
  })

  entity.on('online', (jid) => {
    t.true(jid instanceof xmpp.jid.JID)
    t.is(jid.bare().toString(), 'node-xmpp@localhost')
  })

  entity.start('wss://localhost:5281/xmpp-websocket')
    .then((jid) => {
      t.true(jid instanceof xmpp.jid.JID)
      t.is(jid.bare().toString(), 'node-xmpp@localhost')
    })
    .then(() => {
      t.end()
    })
})
