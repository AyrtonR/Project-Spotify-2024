async function fetchDevices() {
    try {
      const response = await fetch('/devices', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const devices = await response.json();
        displayDevices(devices);
      } else {
        console.error('Error fetching devices:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }
  
  async function activateDevice(deviceId) {
    try {
      const response = await fetch(`/devices/${deviceId}/activate`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        console.log('Device activated successfully');
      } else {
        console.error('Error activating device:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }
  
  function displayDevices(devices) {
    const devicesList = document.getElementById('devices-list');
    devicesList.innerHTML = '';
  
    devices.forEach(device => {
      const deviceItem = document.createElement('li');
      deviceItem.textContent = device.name;
      deviceItem.addEventListener('click', () => activateDevice(device.id));
      devicesList.appendChild(deviceItem);
    });
  }
  
  document.addEventListener('DOMContentLoaded', fetchDevices);
  