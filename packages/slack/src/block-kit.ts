import { Block, KnownBlock } from '@slack/web-api';

// Block Kit builder utilities for common Slack UI patterns
export class SlackBlockBuilder {
  private blocks: (KnownBlock | Block)[] = [];

  section(text: string, accessory?: any): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory,
    });
    return this;
  }

  plainTextSection(text: string, accessory?: any): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text,
      },
      accessory,
    });
    return this;
  }

  divider(): this {
    this.blocks.push({ type: 'divider' });
    return this;
  }

  header(text: string): this {
    this.blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: text.substring(0, 150), // Slack header limit
      },
    });
    return this;
  }

  image(imageUrl: string, altText: string, title?: string): this {
    this.blocks.push({
      type: 'image',
      image_url: imageUrl,
      alt_text: altText,
      title: title ? {
        type: 'plain_text',
        text: title,
      } : undefined,
    });
    return this;
  }

  actions(elements: any[]): this {
    this.blocks.push({
      type: 'actions',
      elements: elements.slice(0, 5), // Slack actions limit
    });
    return this;
  }

  buttons(buttons: Array<{ text: string; actionId: string; value?: string; style?: 'primary' | 'danger'; url?: string; }>): this {
    const buttonElements = buttons.slice(0, 5).map(btn => ({
      type: 'button',
      text: {
        type: 'plain_text',
        text: btn.text.substring(0, 75),
      },
      action_id: btn.actionId,
      value: btn.value,
      style: btn.style,
      url: btn.url,
    }));

    return this.actions(buttonElements);
  }

  staticSelect(
    placeholder: string,
    actionId: string,
    options: Array<{ text: string; value: string; description?: string; }>
  ): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ' ', // Required but can be minimal
      },
      accessory: {
        type: 'static_select',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
        options: options.slice(0, 100).map(opt => ({
          text: {
            type: 'plain_text',
            text: opt.text.substring(0, 75),
          },
          value: opt.value,
          description: opt.description ? {
            type: 'plain_text',
            text: opt.description.substring(0, 75),
          } : undefined,
        })),
      },
    });
    return this;
  }

  multiStaticSelect(
    text: string,
    placeholder: string,
    actionId: string,
    options: Array<{ text: string; value: string; }>
  ): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'multi_static_select',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
        options: options.slice(0, 100).map(opt => ({
          text: {
            type: 'plain_text',
            text: opt.text.substring(0, 75),
          },
          value: opt.value,
        })),
      },
    });
    return this;
  }

  userSelect(text: string, placeholder: string, actionId: string): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'users_select',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
      },
    });
    return this;
  }

  channelSelect(text: string, placeholder: string, actionId: string): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'channels_select',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
      },
    });
    return this;
  }

  conversationSelect(text: string, placeholder: string, actionId: string): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'conversations_select',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
      },
    });
    return this;
  }

  datePicker(text: string, placeholder: string, actionId: string, initialDate?: string): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'datepicker',
        placeholder: {
          type: 'plain_text',
          text: placeholder,
        },
        action_id: actionId,
        initial_date: initialDate,
      },
    });
    return this;
  }

  plainTextInput(
    label: string,
    actionId: string,
    blockId: string,
    placeholder?: string,
    multiline?: boolean,
    initialValue?: string,
    maxLength?: number
  ): this {
    this.blocks.push({
      type: 'input',
      block_id: blockId,
      element: {
        type: 'plain_text_input',
        action_id: actionId,
        placeholder: placeholder ? {
          type: 'plain_text',
          text: placeholder,
        } : undefined,
        multiline,
        initial_value: initialValue,
        max_length: maxLength,
      },
      label: {
        type: 'plain_text',
        text: label,
      },
    });
    return this;
  }

  radioButtons(
    text: string,
    actionId: string,
    options: Array<{ text: string; value: string; description?: string; }>,
    initialOption?: string
  ): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'radio_buttons',
        action_id: actionId,
        options: options.slice(0, 10).map(opt => ({
          text: {
            type: 'plain_text',
            text: opt.text,
          },
          value: opt.value,
          description: opt.description ? {
            type: 'plain_text',
            text: opt.description,
          } : undefined,
        })),
        initial_option: initialOption ? {
          text: {
            type: 'plain_text' as const,
            text: options.find(opt => opt.value === initialOption)?.text || '',
          },
          value: initialOption,
          description: options.find(opt => opt.value === initialOption)?.description ? {
            type: 'plain_text' as const,
            text: options.find(opt => opt.value === initialOption)!.description!,
          } : undefined,
        } : undefined,
      },
    });
    return this;
  }

  checkboxes(
    text: string,
    actionId: string,
    options: Array<{ text: string; value: string; description?: string; }>,
    initialOptions?: string[]
  ): this {
    this.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
      accessory: {
        type: 'checkboxes',
        action_id: actionId,
        options: options.slice(0, 10).map(opt => ({
          text: {
            type: 'plain_text',
            text: opt.text,
          },
          value: opt.value,
          description: opt.description ? {
            type: 'plain_text',
            text: opt.description,
          } : undefined,
        })),
        initial_options: initialOptions ? 
          initialOptions.reduce((acc, value) => {
            const option = options.find(opt => opt.value === value);
            if (option) {
              acc.push({
                text: {
                  type: 'plain_text' as const,
                  text: option.text,
                },
                value: option.value,
                description: option.description ? {
                  type: 'plain_text' as const,
                  text: option.description,
                } : undefined,
              });
            }
            return acc;
          }, [] as any[]) : undefined,
      },
    });
    return this;
  }

  context(elements: Array<{ type: 'plain_text' | 'mrkdwn'; text: string; } | { type: 'image'; image_url: string; alt_text: string; }>): this {
    this.blocks.push({
      type: 'context',
      elements: elements.slice(0, 10), // Slack context elements limit
    });
    return this;
  }

  fields(fields: Array<{ title: string; value: string; short?: boolean; }>): this {
    // Convert fields to section with fields property
    this.blocks.push({
      type: 'section',
      fields: fields.slice(0, 10).map(field => ({
        type: 'mrkdwn',
        text: `*${field.title}*\n${field.value}`,
      })),
    });
    return this;
  }

  build(): (KnownBlock | Block)[] {
    const result = [...this.blocks];
    this.blocks = []; // Reset for reuse
    return result;
  }

  // Clear all blocks and start fresh
  clear(): this {
    this.blocks = [];
    return this;
  }

  // Get current blocks without clearing
  getBlocks(): (KnownBlock | Block)[] {
    return [...this.blocks];
  }
}

// Modal builder utility
export class SlackModalBuilder {
  private view: any = {
    type: 'modal',
    blocks: [],
  };

  title(text: string): this {
    this.view.title = {
      type: 'plain_text',
      text: text.substring(0, 24), // Slack modal title limit
    };
    return this;
  }

  submit(text: string): this {
    this.view.submit = {
      type: 'plain_text',
      text: text.substring(0, 24),
    };
    return this;
  }

  close(text: string): this {
    this.view.close = {
      type: 'plain_text',
      text: text.substring(0, 24),
    };
    return this;
  }

  callbackId(id: string): this {
    this.view.callback_id = id;
    return this;
  }

  privateMetadata(data: string): this {
    this.view.private_metadata = data;
    return this;
  }

  clearOnClose(clear: boolean = true): this {
    this.view.clear_on_close = clear;
    return this;
  }

  notifyOnClose(notify: boolean = true): this {
    this.view.notify_on_close = notify;
    return this;
  }

  blocks(blocks: (KnownBlock | Block)[]): this {
    this.view.blocks = blocks.slice(0, 100); // Slack modal blocks limit
    return this;
  }

  addBlocks(blocks: (KnownBlock | Block)[]): this {
    this.view.blocks = [...(this.view.blocks || []), ...blocks].slice(0, 100);
    return this;
  }

  build(): any {
    return { ...this.view };
  }
}

// App Home builder utility
export class SlackAppHomeBuilder {
  private view: any = {
    type: 'home',
    blocks: [],
  };

  blocks(blocks: (KnownBlock | Block)[]): this {
    this.view.blocks = blocks.slice(0, 100); // Slack home blocks limit
    return this;
  }

  addBlocks(blocks: (KnownBlock | Block)[]): this {
    this.view.blocks = [...(this.view.blocks || []), ...blocks].slice(0, 100);
    return this;
  }

  privateMetadata(data: string): this {
    this.view.private_metadata = data;
    return this;
  }

  callbackId(id: string): this {
    this.view.callback_id = id;
    return this;
  }

  externalId(id: string): this {
    this.view.external_id = id;
    return this;
  }

  build(): any {
    return { ...this.view };
  }
}

// Convenience functions for common patterns
export const blockKit = {
  builder: () => new SlackBlockBuilder(),
  modal: () => new SlackModalBuilder(),
  appHome: () => new SlackAppHomeBuilder(),

  // Quick block creators
  section: (text: string) => ({
    type: 'section' as const,
    text: { type: 'mrkdwn' as const, text },
  }),

  button: (text: string, actionId: string, value?: string, style?: 'primary' | 'danger') => ({
    type: 'button' as const,
    text: { type: 'plain_text' as const, text: text.substring(0, 75) },
    action_id: actionId,
    value,
    style,
  }),

  divider: () => ({ type: 'divider' as const }),

  header: (text: string) => ({
    type: 'header' as const,
    text: { type: 'plain_text' as const, text: text.substring(0, 150) },
  }),

  image: (imageUrl: string, altText: string) => ({
    type: 'image' as const,
    image_url: imageUrl,
    alt_text: altText,
  }),
}; 