import os
from langchain_openai import ChatOpenAI

def get_llm_model(model_name="gpt-4o", temperature=0):
    """
    Creates and returns a ChatOpenAI model instance.
    
    Args:
        model_name (str): The OpenAI model to use
        temperature (float): Controls randomness (0 to 1)
        
    Returns:
        ChatOpenAI: An instance of the language model
    """
    try:
        return ChatOpenAI(
            model=model_name, 
            temperature=temperature,
        )
    except Exception as e:
        print(f"Error initializing LLM model: {e}")
        raise

# Default model instance
gpt_model = get_llm_model()