// Import required hooks and axios library.
import { useState, useEffect } from "react";
import axios from "axios";

// Declare a custom hook called 'useAxiosFetch' that takes in a URL as an argument.
const useAxiosFetch = (dataUrl) => {
  // Initialize state variables 'data', 'fetchError', and 'isLoading'.
  const [data, setData] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect hook is used to perform side effects in functional components.
  useEffect(() => {
    // 'isMounted' is used to keep track of the component's mounted state.
    let isMounted = true;

    // Initialize a cancel token source for axios to cancel ongoing requests.
    const source = axios.CancelToken.source();

    // Declare an async function 'fetchData' to fetch data from the API using axios.
    const fetchData = async (url) => {
      // Set 'isLoading' state to true before starting the fetch operation.
      setIsLoading(true);

      try {
        // Fetch data from the given URL using axios and the cancel token.
        const response = await axios.get(url, {
          cancelToken: source.token,
        });

        // If the component is still mounted, update the state with the fetched data and reset the error state.
        if (isMounted) {
          setData(response.data);
          setFetchError(null);
        }
      } catch (error) {
        // If an error occurs and the component is still mounted, update the error state and reset the data state.
        if (isMounted) {
          setFetchError(error.message);
          setData([]);
        }
      } finally {
        // If the component is still mounted, set 'isLoading' state to false after a 2-second delay.
        isMounted && setIsLoading(false);
      }
    };

    // Call 'fetchData' with the provided 'dataUrl'.
    fetchData(dataUrl);

    // Declare a clean-up function that will run when the component is unmounted.
    const cleanUp = () => {
      console.log("cleanUp");

      // Set 'isMounted' to false to prevent state updates on unmounted components.
      isMounted = false;

      // Cancel the ongoing axios request if any.
      source.cancel();
    };

    // Return the clean-up function to be executed on unmounting.
    return cleanUp;
  }, [dataUrl]); // The effect will run whenever 'dataUrl' changes.

  // Return an object containing the fetched data, error message, and loading state.
  return { data, fetchError, isLoading };
};

// Export the custom hook 'useAxiosFetch' for use in other components.
export default useAxiosFetch;
