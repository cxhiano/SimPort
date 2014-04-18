'''
Server
'''
import os.path
import json
import logging
import tornado.ioloop
import tornado.web
import media
from tornado.web import RequestHandler

md = media.Media()

class MainHandler(RequestHandler):
    '''
    Display home page
    '''
    def get(self):
        return self.render('display.html', title='Sim Port')

class InstructionUpdateHandler(RequestHandler):
    @tornado.web.asynchronous
    def post(self):
        md.feedback(self.request.body)
        md.register_updater(self._on_new_instruction)

    def _on_new_instruction(self, instr):
        '''
        callback used to send instruction to browser,
        end asynchronous http request and return instr
        '''
        if self.request.connection.stream.closed():
            return
        self.finish(instr)

class NewInstructionHandler(RequestHandler):
    '''
    receive instruction from http request and send it to browser
    '''
    @tornado.web.asynchronous
    def post(self):
        data = json.loads(self.request.body)
        md.new(self.request.body, self._feedback)

    def _feedback(self, data):
        if self.request.connection.stream.closed():
            return
        self.finish(data)

def main():
    '''
    setup server
    '''
    app = tornado.web.Application(
            [
                (r'/', MainHandler),
                (r'/instr/get', InstructionUpdateHandler),
                (r'/instr/new', NewInstructionHandler),
                ],
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'static'),
            )
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__': 
    logging.basicConfig(level=logging.DEBUG)
    main()
