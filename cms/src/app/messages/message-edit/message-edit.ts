import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.html',
  styleUrl: './message-edit.css',
})
export class MessageEdit {
  @ViewChild('subject', {static: true}) subject: ElementRef;
  @ViewChild('msgText', {static: true}) msgText: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  //currentSender = 'Benjamin';
  currentSender = '5';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    let message = new Message(
      '1', this.subject.nativeElement.value, 
      this.msgText.nativeElement.value, this.currentSender
    );
    
    //this.addMessageEvent.emit(message);
    this.messageService.addMessage(message);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
}
