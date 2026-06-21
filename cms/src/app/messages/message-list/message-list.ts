import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageList implements OnInit {
  messages: Message[] = [];

  subscription: Subscription;

  constructor(private messageService: MessageService) {}

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

  ngOnInit() {
    /*this.messages = this.messageService.getMessages();

    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    }); */

    this.messageService.getMessages();

    this.subscription = this.messageService.messagesListChangedEvent.subscribe(
      (messagesList: Message[]) => {
        this.messages = messagesList;
      }
    );
  }
}
