const fs = require('fs')
const dbSchemaResetor = require('./db-schema-resetor')
const fakeDataGenerator = require('./fake-data-generator')
const fakeDataInjector = require('./fake-data-injector')

async function main () {
  while (true) {
    try {
      await dbSchemaResetor.resetDB()
      await fakeDataGenerator.generateFakeData()
      await fakeDataInjector.injectFakeData()
      break
    } catch (err) {
      console.log(err)
      console.log('inject fail, run again!')
      continue
    }
  }
  console.log('db schema reset & data inject success!')
}

main()
