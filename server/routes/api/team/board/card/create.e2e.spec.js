// 'use strict'
//
// const request = require('co-supertest')
// const expect = require('chai').expect
//
// const server = require('../../../../../server')
// const Column = require('../../../../../models/column')
// const userFixtures = require('../../../../../fixtures/user')
// const teamFixtures = require('../../../../../fixtures/team')
// const boardFixtures = require('../../../../../fixtures/board')
// const columnFixtures = require('../../../../../fixtures/column')
// const cardFixtures = require('../../../../../fixtures/card')
//
// describe('POST /api/team/:teamId/board/card', function () {
//   let user
//   let token
//   let team
//   let board
//
//   beforeEach(function *() {
//     let result = yield userFixtures.createLoggedInUser()
//
//     user = result.user
//     token = result.token
//
//     team = yield teamFixtures.create([user.id])
//     board = yield boardFixtures.create(team.id)
//   })
//
//   afterEach(function *() {
//     yield [
//       userFixtures.destroyLoggedInUser(user),
//       teamFixtures.destroy(team),
//       boardFixtures.destroy(board)
//     ]
//   })
//
//   it('should create a board', function * () {
//     const resp = yield request(server.listen())
//       .post(`/api/team/${team.id}/board/${board.id}/column`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         data: {
//           name: 'My Column'
//         }
//       })
//       .expect(201)
//       .expect('Content-Type', /application\/json/)
//       .end()
//
//     // expect
//     const column = yield Column
//       .get(resp.body.id)
//       .run()
//
//     expect(resp.body).to.be.eql({
//       id: column.id,
//       name: 'My Column',
//       createdAt: column.createdAt.toISOString(),
//       boardId: board.id,
//       isRemoved: false,
//       orderIndex: 0
//     })
//
//     yield column.delete()
//   })
//
//   describe('with increasing index', () => {
//     let columnExisting
//
//     beforeEach(function *() {
//       columnExisting = yield columnFixtures.create(board.id)
//     })
//
//     afterEach(function *() {
//       yield [
//         columnFixtures.destroy(columnExisting)
//       ]
//     })
//
//     it('should create a board', function * () {
//       const resp = yield request(server.listen())
//         .post(`/api/team/${team.id}/board/${board.id}/column`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           data: {
//             name: 'My Column'
//           }
//         })
//         .expect(201)
//         .expect('Content-Type', /application\/json/)
//         .end()
//
//       // expect
//       const column = yield Column
//         .get(resp.body.id)
//         .run()
//
//       expect(resp.body.orderIndex).to.be.eql(1)
//
//       yield column.delete()
//     })
//   })
//
//   it('should reject invalid body', function * () {
//     yield request(server.listen())
//       .post(`/api/team/${team.id}/board/${board.id}/column`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         data: {}
//       })
//       .expect(400)
//       .expect('Content-Type', /application\/json/)
//       .end()
//   })
//
//   it('should reject if board is missing', function * () {
//     yield request(server.listen())
//       .post(`/api/team/${team.id}/board/booard/column`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         data: {
//           name: 'My Column'
//         }
//       })
//       .expect(404)
//       .expect('Content-Type', /application\/json/)
//       .end()
//   })
//
//   describe('board auth', () => {
//     let user2
//     let team2
//     let board2
//
//     beforeEach(function *() {
//       let result = yield userFixtures.createLoggedInUser()
//       user2 = result.user
//
//       team2 = yield teamFixtures.create([user2.id])
//       board2 = yield boardFixtures.create(team2.id)
//     })
//
//     afterEach(function *() {
//       yield [
//         userFixtures.destroyLoggedInUser(user2),
//         teamFixtures.destroy(team2),
//         boardFixtures.destroy(board2)
//       ]
//     })
//
//     it('should reject if board access is unauthorized', function * () {
//       yield request(server.listen())
//         .post(`/api/team/${team.id}/board/${board2.id}/column`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({
//           data: {
//             name: 'My Column'
//           }
//         })
//         .expect(401)
//         .expect('Content-Type', /application\/json/)
//         .end()
//     })
//   })
// })
