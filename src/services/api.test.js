import { sendChatMessage, api } from './api';

describe('sendChatMessage API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('correctly handles plain string prompt from Ambient Voice modal', async () => {
    const postSpy = jest.spyOn(api, 'post').mockResolvedValueOnce({
      data: { type: 'text', content: 'Hello! How can I help you today?' },
    });

    const result = await sendChatMessage('hello');

    expect(postSpy).toHaveBeenCalledWith('/api/chat/', {
      message: 'hello',
      conversation_id: null,
      use_web_search: false,
      mode: null,
      requestType: null,
      latitude: null,
      longitude: null,
      city: null,
    });
    expect(result.content).toBe('Hello! How can I help you today?');
  });

  test('correctly handles structured object payload', async () => {
    const postSpy = jest.spyOn(api, 'post').mockResolvedValueOnce({
      data: { type: 'text', content: 'Here is the news.' },
    });

    const result = await sendChatMessage({
      message: 'latest news',
      mode: 'news',
      use_web_search: true,
    });

    expect(postSpy).toHaveBeenCalledWith('/api/chat/', {
      message: 'latest news',
      conversation_id: null,
      use_web_search: true,
      mode: 'news',
      requestType: null,
      latitude: null,
      longitude: null,
      city: null,
    });
    expect(result.content).toBe('Here is the news.');
  });
});
