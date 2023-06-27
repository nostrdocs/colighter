export function convertUnixTimestampToDate(timestamp: number): string {
    // Convert Unix timestamp to milliseconds
    const milliseconds = timestamp * 1000;
  
    // Create a new Date object
    const date = new Date(milliseconds);
  
    // Define the month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Get the components of the date
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    // Format the date
    const formattedDate = `${month} ${day}, ${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return formattedDate;
  }