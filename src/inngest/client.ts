import { Inngest } from 'inngest'

// Define types for all async events in the system
export type EventPayloads = {
  'test/hello.world': {
    data: {
      message: string
    }
  }
  'content.idea.requested': {
    data: {
      channelId: string
      userId: string
    }
  }
  'content.script.requested': {
    data: {
      projectId: string
      userId: string
    }
  }
  'content.script.generated': {
    data: {
      projectId: string
      scriptId: string
      userId: string
    }
  }
  'content.voiceover.requested': {
    data: {
      projectId: string
      scriptId: string
      userId: string
    }
  }
  'content.voiceover.generated': {
    data: {
      projectId: string
      voiceoverId: string
      userId: string
    }
  }
  'content.assets.requested': {
    data: {
      projectId: string
      userId: string
    }
  }
  'content.assets.generated': {
    data: {
      projectId: string
      userId: string
    }
  }
  'content.video.render.requested': {
    data: {
      projectId: string
      userId: string
    }
  }
  'content.video.rendered': {
    data: {
      projectId: string
      videoId: string
      userId: string
    }
  }
  'publication.youtube.upload.requested': {
    data: {
      publicationId: string
      userId: string
    }
  }
  'publication.youtube.uploaded': {
    data: {
      publicationId: string
      userId: string
    }
  }
  'publication.youtube.schedule.requested': {
    data: {
      publicationId: string
      userId: string
    }
  }
  'publication.youtube.scheduled': {
    data: {
      publicationId: string
      userId: string
    }
  }
  'publication.failed': {
    data: {
      publicationId: string
      error: string
      userId: string
    }
  }
}

// Initialize the Inngest client
export const inngest = new Inngest({
  id: 'dark-factory',
})
