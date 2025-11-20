import requests
import xml.etree.ElementTree as ET
from flask import current_app

def validate_address(address, city, state, zip_code):
    """
    Validate and standardize address using USPS API
    
    Args:
        address: Street address
        city: City name
        state: State abbreviation
        zip_code: ZIP code
        
    Returns:
        dict: Standardized address or error
    """
    try:
        # USPS API credentials - will be configured in environment
        user_id = current_app.config.get('USPS_USER_ID', '')
        
        if not user_id:
            return {
                'success': False,
                'error': 'USPS API not configured'
            }
        
        # Build XML request
        xml_request = f"""
        <AddressValidateRequest USERID="{user_id}">
            <Revision>1</Revision>
            <Address ID="0">
                <Address1></Address1>
                <Address2>{address}</Address2>
                <City>{city}</City>
                <State>{state}</State>
                <Zip5>{zip_code}</Zip5>
                <Zip4></Zip4>
            </Address>
        </AddressValidateRequest>
        """
        
        # Make request to USPS API
        response = requests.get(
            'https://secure.shippingapis.com/ShippingAPI.dll',
            params={
                'API': 'Verify',
                'XML': xml_request.strip()
            },
            timeout=10
        )
        
        # Parse XML response
        root = ET.fromstring(response.content)
        
        # Check for errors
        error = root.find('.//Error')
        if error is not None:
            error_description = error.find('Description')
            return {
                'success': False,
                'error': error_description.text if error_description is not None else 'Unknown error'
            }
        
        # Extract standardized address
        address_element = root.find('.//Address')
        if address_element is not None:
            standardized = {
                'success': True,
                'address': address_element.findtext('Address2', ''),
                'city': address_element.findtext('City', ''),
                'state': address_element.findtext('State', ''),
                'zip5': address_element.findtext('Zip5', ''),
                'zip4': address_element.findtext('Zip4', '')
            }
            
            # Build full formatted address
            full_address = standardized['address']
            if standardized['city']:
                full_address += f", {standardized['city']}"
            if standardized['state']:
                full_address += f", {standardized['state']}"
            if standardized['zip5']:
                zip_full = standardized['zip5']
                if standardized['zip4']:
                    zip_full += f"-{standardized['zip4']}"
                full_address += f" {zip_full}"
            
            standardized['full_address'] = full_address
            return standardized
        
        return {
            'success': False,
            'error': 'No address data in response'
        }
        
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error': 'USPS API request timed out'
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f'USPS API request failed: {str(e)}'
        }
    except ET.ParseError as e:
        return {
            'success': False,
            'error': f'Failed to parse USPS response: {str(e)}'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Unexpected error: {str(e)}'
        }
