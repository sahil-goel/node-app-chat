var expect = require("expect");
var {generateMessage, generateLocationMessage} = require("./messages");

describe("generateMessage", () => {
  it("should generate correct message object", ()=>{
    var text = 'Some random text';
    var from = 'someone';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location message object", ()=>{
    var latitude = 1.89;
    var longitude = 8.89;
    var from = 'someone';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from:from, url : 'https://www.google.com/maps?q=1.89,8.89'});
  });
});
