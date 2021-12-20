const app = require('../app');
const request = require('supertest');

describe("POST /findServer",()=>{
    test("should respond with active server with lowest priority",async ()=>{
        const response = await request(app).post("/api/v1/findServer").send(
            [{
                "url": "http://doesNotExist.boldtech.co",
                "priority": 1
            }, {
                "url": "http://boldtech.co",
                "priority": 7
            }, {
                "url": "http://offline.boldtech.co",
                "priority": 2
            },{
                "url": "http://google.com",
                "priority": 4
            }]          
        )
        let matchingObject = {
            success: true,
            result: {
                url: "http://google.com",
                priority: 4
            }
        };
        expect(response.body).toMatchObject(matchingObject);
    });

    test("should respond with no server found",async ()=>{
        const response = await request(app).post("/api/v1/findServer").send(
            [{
                "url": "http://doesNotExist.boldtech.co",
                "priority": 1
            },{
                "url": "http://offline.boldtech.co",
                "priority": 2
            }]          
        )
        let matchingObject = {
            "success": true,
            "message": "All servers are offLine",
            "result": []
        };
        expect(response.body).toMatchObject(matchingObject);
    });
});