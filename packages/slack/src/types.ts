import { PlatformConfig } from '@romeo/core';
import { WebAPICallResult, Block, KnownBlock } from '@slack/web-api';

export interface SlackConfig extends PlatformConfig {
  platform: 'slack';
  credentials: {
    botToken: string;
    signingSecret: string;
    appToken?: string; // For Socket Mode
    clientId?: string;
    clientSecret?: string;
  };
  socketMode?: boolean;
}

// Slack-specific message types
export interface SlackTextMessage {
  type: 'mrkdwn' | 'plain_text';
  text: string;
  emoji?: boolean;
  verbatim?: boolean;
}

export interface SlackAttachment {
  color?: string;
  fallback?: string;
  fields?: Array<{
    title: string;
    value: string;
    short?: boolean;
  }>;
  footer?: string;
  footer_icon?: string;
  image_url?: string;
  thumb_url?: string;
  title?: string;
  title_link?: string;
  ts?: number;
}

export interface SlackMessageOptions {
  channel: string;
  text?: string;
  blocks?: (KnownBlock | Block)[];
  attachments?: SlackAttachment[];
  thread_ts?: string; // Reply to thread
  reply_broadcast?: boolean;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
  username?: string;
  icon_emoji?: string;
  icon_url?: string;
  link_names?: boolean;
  parse?: 'full' | 'none';
}

// Slack Events API types
export interface SlackEventCallback {
  token: string;
  team_id: string;
  api_app_id: string;
  event: SlackEvent;
  type: 'event_callback';
  event_id: string;
  event_time: number;
  authorizations?: Array<{
    enterprise_id?: string;
    team_id: string;
    user_id: string;
    is_bot: boolean;
    is_enterprise_install?: boolean;
  }>;
  is_ext_shared_channel?: boolean;
  event_context?: string;
}

export interface SlackEvent {
  type: string;
  user?: string;
  channel?: string;
  ts?: string;
  thread_ts?: string;
  text?: string;
  blocks?: (KnownBlock | Block)[];
  files?: SlackFile[];
  subtype?: string;
  bot_id?: string;
  app_id?: string;
  team?: string;
  channel_type?: 'channel' | 'group' | 'im' | 'mpim';
}

export interface SlackMessageEvent extends SlackEvent {
  type: 'message';
  user: string;
  channel: string;
  ts: string;
  text: string;
  thread_ts?: string;
  reply_count?: number;
  replies?: Array<{
    user: string;
    ts: string;
  }>;
  edited?: {
    user: string;
    ts: string;
  };
}

export interface SlackFile {
  id: string;
  name: string;
  title: string;
  mimetype: string;
  filetype: string;
  size: number;
  url_private: string;
  url_private_download: string;
  permalink: string;
  permalink_public?: string;
  thumb_64?: string;
  thumb_80?: string;
  thumb_160?: string;
  thumb_360?: string;
  thumb_480?: string;
  thumb_720?: string;
  thumb_800?: string;
  thumb_960?: string;
  thumb_1024?: string;
  original_w?: number;
  original_h?: number;
  is_external?: boolean;
  external_type?: string;
  is_public?: boolean;
  public_url_shared?: boolean;
  display_as_bot?: boolean;
  username?: string;
  timestamp?: number;
  channels?: string[];
  groups?: string[];
  ims?: string[];
  comments_count?: number;
}

// Slack App Home and Interactive Components
export interface SlackInteractivePayload {
  type: 'block_actions' | 'interactive_message' | 'dialog_submission' | 'view_submission' | 'view_closed' | 'shortcut' | 'message_action';
  token: string;
  action_ts: string;
  team: {
    id: string;
    domain: string;
  };
  user: {
    id: string;
    name: string;
    username?: string;
  };
  channel?: {
    id: string;
    name: string;
  };
  message?: {
    type: string;
    user: string;
    ts: string;
    text: string;
    thread_ts?: string;
  };
  actions?: SlackAction[];
  callback_id?: string;
  trigger_id?: string;
  response_url?: string;
  view?: SlackView;
  api_app_id: string;
  is_enterprise_install?: boolean;
  enterprise?: {
    id: string;
    name: string;
  };
}

export interface SlackAction {
  type: string;
  action_id: string;
  block_id?: string;
  text?: SlackTextMessage;
  value?: string;
  style?: 'primary' | 'danger';
  confirm?: {
    title: SlackTextMessage;
    text: SlackTextMessage;
    confirm: SlackTextMessage;
    deny: SlackTextMessage;
    style?: 'primary' | 'danger';
  };
  url?: string;
  selected_option?: {
    text: SlackTextMessage;
    value: string;
  };
  selected_options?: Array<{
    text: SlackTextMessage;
    value: string;
  }>;
  selected_date?: string;
  selected_time?: string;
  initial_date?: string;
  initial_time?: string;
  selected_conversations?: string[];
  selected_channels?: string[];
  selected_users?: string[];
}

export interface SlackView {
  id: string;
  team_id: string;
  type: 'modal' | 'home';
  title?: SlackTextMessage;
  submit?: SlackTextMessage;
  close?: SlackTextMessage;
  blocks: (KnownBlock | Block)[];
  private_metadata?: string;
  callback_id?: string;
  state?: {
    values: Record<string, Record<string, any>>;
  };
  hash: string;
  clear_on_close?: boolean;
  notify_on_close?: boolean;
  root_view_id?: string;
  previous_view_id?: string;
  app_id?: string;
  external_id?: string;
  app_installed_team_id?: string;
  bot_id?: string;
}

// Slack Slash Commands
export interface SlackSlashCommand {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  api_app_id: string;
  is_enterprise_install?: boolean;
  enterprise_id?: string;
  enterprise_name?: string;
}

// API Response types
export interface SlackApiResponse extends WebAPICallResult {
  ok: boolean;
  error?: string;
  warning?: string;
  response_metadata?: {
    next_cursor?: string;
    warnings?: string[];
  };
}

export interface SlackPostMessageResponse extends SlackApiResponse {
  channel: string;
  ts: string;
  message: {
    type: string;
    subtype?: string;
    text: string;
    ts: string;
    username?: string;
    bot_id?: string;
    app_id?: string;
    blocks?: (KnownBlock | Block)[];
    attachments?: SlackAttachment[];
  };
}

export interface SlackUserInfo extends SlackApiResponse {
  user: {
    id: string;
    team_id: string;
    name: string;
    deleted?: boolean;
    color?: string;
    real_name?: string;
    tz?: string;
    tz_label?: string;
    tz_offset?: number;
    profile: {
      avatar_hash?: string;
      status_text?: string;
      status_emoji?: string;
      real_name?: string;
      display_name?: string;
      real_name_normalized?: string;
      display_name_normalized?: string;
      email?: string;
      image_24?: string;
      image_32?: string;
      image_48?: string;
      image_72?: string;
      image_192?: string;
      image_512?: string;
      team?: string;
    };
    is_admin?: boolean;
    is_owner?: boolean;
    is_primary_owner?: boolean;
    is_restricted?: boolean;
    is_ultra_restricted?: boolean;
    is_bot?: boolean;
    is_app_user?: boolean;
    updated?: number;
    is_email_confirmed?: boolean;
    who_can_share_contact_card?: string;
  };
}

export interface SlackConversationInfo extends SlackApiResponse {
  channel: {
    id: string;
    name?: string;
    is_channel?: boolean;
    is_group?: boolean;
    is_im?: boolean;
    is_mpim?: boolean;
    is_private?: boolean;
    created?: number;
    creator?: string;
    is_archived?: boolean;
    is_general?: boolean;
    unlinked?: number;
    name_normalized?: string;
    is_shared?: boolean;
    is_ext_shared?: boolean;
    is_org_shared?: boolean;
    pending_shared?: string[];
    pending_connected_team_ids?: string[];
    is_pending_ext_shared?: boolean;
    is_member?: boolean;
    is_open?: boolean;
    last_read?: string;
    latest?: SlackEvent;
    unread_count?: number;
    unread_count_display?: number;
    members?: string[];
    topic?: {
      value: string;
      creator: string;
      last_set: number;
    };
    purpose?: {
      value: string;
      creator: string;
      last_set: number;
    };
    previous_names?: string[];
    priority?: number;
  };
} 