import requests
import json

def get_lockbox_trivia(target_number):
    """
    Fetch trivia facts for each digit in the target number (answer)
    Args: target_number - the number the user must guess
    Returns: JSON formatted trivia facts with numbers hidden
    """
    # Convert target number to list of digits
    target_digits = [int(digit) for digit in str(target_number)]
    
    trivia_data = {
        "target_number": target_number,
        "digit_count": len(target_digits),
        "trivia_facts": []
    }
    
    for i, digit in enumerate(target_digits):
        try:
            url = f"http://numbersapi.com/{digit}/trivia"
            response = requests.get(url, timeout=5)
            
            if response.status_code == 200:
                original_fact = response.text.strip()
                # Replace the digit with underscores in the fact text
                hidden_fact = original_fact.replace(str(digit), "_" * len(str(digit)))
                
                fact_data = {
                    "position": i + 1,
                    "hidden_digit": "_",
                    "fact": hidden_fact
                }
            else:
                fact_data = {
                    "position": i + 1,
                    "hidden_digit": "_",
                    "fact": "No trivia available for this digit"
                }
                
        except requests.RequestException as e:
            fact_data = {
                "position": i + 1,
                "hidden_digit": "_",
                "fact": f"Error fetching trivia: {str(e)}"
            }
        
        trivia_data["trivia_facts"].append(fact_data)
    
    return json.dumps(trivia_data, indent=2)

if __name__ == "__main__":
    # Test with sample target number
    sample_target = 123
    print(f"Fetching trivia facts for target number: {sample_target}")
    print("=" * 50)
    result = get_lockbox_trivia(sample_target)
    print(result)
