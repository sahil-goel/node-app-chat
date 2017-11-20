var expect = require("expect");
var {generateMessage} = require("./messages");

describe("generateMessage", () => {
  it("should generate correct message object", ()=>{
    var text = 'Some random text';
    var from = 'someone';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});
