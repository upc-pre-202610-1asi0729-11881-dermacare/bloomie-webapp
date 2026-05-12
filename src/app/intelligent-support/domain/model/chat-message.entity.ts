import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents who authored a chat message in a support query session.
 */
export enum MessageType {
  User = 'USER',
  Ai = 'AI',
  System = 'SYSTEM',
}

/**
 * Represents a single message exchanged inside a support query chat session.
 */
export class ChatMessage implements BaseEntity {
  /**
   * Creates a new ChatMessage entity.
   * @param props - Initialization values for the chat message.
   */
  constructor(props: {
    id: number;
    supportQueryId: number;
    text: string;
    type: MessageType;
    sentAt: string;
  }) {
    this._id = props.id;
    this._supportQueryId = props.supportQueryId;
    this._text = props.text;
    this._type = props.type;
    this._sentAt = props.sentAt;
  }

  /** Unique identifier for the chat message. */
  private _id: number;

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  /** Identifier of the support query this message belongs to. */
  private _supportQueryId: number;

  get supportQueryId(): number {
    return this._supportQueryId;
  }

  /** Text content of the message. */
  private _text: string;

  get text(): string {
    return this._text;
  }
  set text(value: string) {
    this._text = value;
  }

  /** Who authored this message: the user, the AI, or a system notification. */
  private _type: MessageType;

  get type(): MessageType {
    return this._type;
  }

  /** ISO 8601 date-time string for when the message was sent. */
  private _sentAt: string;

  get sentAt(): string {
    return this._sentAt;
  }

  /**
   * Returns true if this message was authored by the user.
   */
  get isUserMessage(): boolean {
    return this._type === MessageType.User;
  }

  /**
   * Returns true if this message was authored by the AI assistant.
   */
  get isAiMessage(): boolean {
    return this._type === MessageType.Ai;
  }

  /**
   * Returns a display-friendly formatted timestamp for the message.
   * @returns Formatted time as 'HH:mm'.
   */
  get formattedSentAt(): string {
    return new Date(this._sentAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
