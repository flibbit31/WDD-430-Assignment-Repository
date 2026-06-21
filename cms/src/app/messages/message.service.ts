import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];

  messageChangedEvent = new EventEmitter<Message[]>();

  messagesListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(private httpClient: HttpClient) {
    //this.messages = MOCKMESSAGES;

    //this.maxMessageId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getMessages() {
    this.httpClient.get<Message[]>('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/messages.json').subscribe((messages: Message[]) => {
      this.messages = messages;
      console.log(this.messages);
      this.maxMessageId = this.getMaxId();
      this.messages.sort((a, b) => {
        if (a < b) {
          return -1;
        }

        else if (a > b) {
          return 1;
        }

        else {
          return 0;
        }
      });

      this.messagesListChangedEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
    //return this.messages.slice();
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.put('https://wdd-430-cms-b7c30-default-rtdb.firebaseio.com/messages.json',
      messagesString,
    {
      headers: headers
    }).subscribe(() => {
      this.messagesListChangedEvent.next(this.messages.slice());
    });
  }

  getMessage(id: string) {
    for(const message of this.messages) {
      if(message.id === id) {
        return message;
      }
    }

    return null;
  }

  addMessage(message: Message) {
    if (message === undefined || message === null) {
      return;
    }

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);

    //this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }
}
