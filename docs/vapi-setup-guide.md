# Vapi Setup Guide for AI Interview App

This guide will walk you through setting up Vapi for your AI interview application. There are two main components:

1. **Interview Configuration**: A voice assistant that helps users configure their interview settings
2. **Interview Conductor**: A voice assistant that conducts the actual interview based on the configured settings

## Prerequisites

- A Vapi account ([sign up here](https://vapi.ai))
- API key from Vapi dashboard
- Basic understanding of Vapi's workflow and assistant features

## Step 1: Get Your Vapi API Key

1. Log in to your Vapi dashboard
2. Navigate to "API Keys" or "Settings"
3. Create a new API key if you don't already have one
4. Copy the API key and add it to your `.env` file as `NEXT_PUBLIC_VAPI_API_KEY`

## Step 2: Create an Interview Configuration Assistant

For the interview configuration phase, we'll create a simple assistant that asks about job role, experience level, and technologies.

1. In your Vapi dashboard, go to "Assistants"
2. Click "Create New Assistant"
3. Configure the assistant with the following settings:

**Basic Information:**
- **Name**: "Interview Configuration Assistant"
- **First Message**: "Hello, I'll help you configure your interview. What job role and experience level are you interested in?"

**System Prompt:**
```
You are an assistant that helps configure interview settings. 
Ask the user about their desired job role, experience level (junior, mid, senior), and technologies they'd like to focus on. 
Your goal is to collect this information in a conversational manner.
Keep responses concise and natural.

Information you need to collect:
1. Job role (e.g., Software Engineer, Product Manager, Data Scientist)
2. Experience level (junior, mid, senior)
3. Technologies or skills relevant to the position

Engage in a natural conversation, asking for each piece of information if the user hasn't provided it.
When you have all the information, thank the user and let them know their interview is configured.
```

**Model Settings:**
- Provider: OpenAI
- Model: gpt-4 (or another capable model)

**Voice Settings:**
- Provider: 11Labs (recommended)
- Voice: rachel (or another natural-sounding voice)

**Transcriber Settings:**
- Provider: Deepgram
- Model: nova-2

4. Save the assistant

## Step 3: Create an Interview Workflow (Optional)

If you want more structured control over the interview process, you can create a workflow:

1. In your Vapi dashboard, go to "Workflows"
2. Click "Create New Workflow"
3. Name it "Interview Process"
4. Build a workflow with these nodes:

**Introduction Node (Say):**
- Configure a message that introduces the interviewer and explains the process

**Question Nodes (multiple Gather nodes):**
- Create one or more gather nodes that ask interview questions and collect responses
- You can use the questions generated in your application or hardcode some example questions

**Feedback Node (Say):**
- Provides some closing feedback to the interviewee

**End Call Node (Hangup):**
- Ends the interview when complete

5. Save the workflow and copy its ID to your `.env` file as `NEXT_PUBLIC_VAPI_WORKFLOW_ID`

## Step 4: Configure Your Application

With everything set up in Vapi, your application is ready to use the assistants:

1. Ensure your `.env` file has the following variables:
   ```
   NEXT_PUBLIC_VAPI_API_KEY=your_api_key_here
   NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_workflow_id_here (optional)
   ```

2. The application will now use your Vapi configuration when users start the interview process

## Troubleshooting

If you encounter a 400 Bad Request error:
- Check that your API key is correctly formatted and valid
- Verify that your assistant configuration follows Vapi's expected format
- Make sure you're using the latest version of the Vapi Web SDK

Common issues:
- Missing or incorrect API key
- Invalid assistant configuration format
- Missing permissions for the workflow
- Browser microphone permissions not granted

## Additional Resources

- [Vapi Documentation](https://docs.vapi.ai/)
- [Vapi Web SDK Reference](https://docs.vapi.ai/sdks/web)
- [Vapi Workflows Guide](https://docs.vapi.ai/workflows)

For further assistance, contact Vapi support or check their community forums. 