'use client'
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState('');
  const [files, setFiles] = useState<File[]>([]); // Change to an array to hold multiple files
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', price);
    formData.append('amout', amount);
    formData.append('description', description);
    formData.append('productType', productType);
    files.forEach(file => {
      formData.append('files', file); // Append each file to form data
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessage('Product added successfully!');
    setLoading(false);
  };

  const handleReset = () => {
    setProductName('');
    setPrice('');
    setAmount('');
    setDescription('');
    setProductType('');
    setFiles([]); // Reset files
    setMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Update state with selected files
    }
  };  

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName)); // Remove file from state
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 space-y-4 w-200">
      <h2 className="text-xl font-semibold text-gray-700">Add New Product</h2>
      <div>
        <label htmlFor="productName" className="block text-gray-600">Product Name</label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-gray-600">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder='VND'
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ appearance: 'none', MozAppearance: 'textfield' }} // Hide spinner
          min={0}
        />
        
      </div>

      <div>
        <label htmlFor="price" className="block text-gray-600">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ appearance: 'none', MozAppearance: 'textfield' }} // Hide spinner
          min={0}
        />
        <style jsx>{`
          input[type='number']::-webkit-inner-spin-button,
          input[type='number']::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `}</style>
      </div>

      <div>
        <label htmlFor="productType" className="block text-gray-600">Product Type</label>
        <select
          id="productType"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a type</option>
          <option value="accounts">Acccount</option>
          <option value="items">Game Item</option>
          <option value="keys">Key</option>

        </select>
      </div>
       <div>
        <label htmlFor="file" className="block text-gray-600">Upload Images</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          accept="image/*" // Accept only image files
          multiple // Allow multiple file selection
        />
        <ul className="mt-2">
          {files.map((file) => (
            <li key={file.name} className="flex justify-between items-center">
              <span>{file.name}</span>
              <button type="button" onClick={() => removeFile(file.name)} className="text-black text-2xl size-5">x</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-600">Description</label>
        <TextareaAutosize
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 w-full h-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
          minRows={3}
          maxRows={6}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          type="submit"
          className={`bg-blue-600 text-white p-2 rounded-md transition duration-200 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 p-2 rounded-md transition duration-200 hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
      {message && <p className="text-green-500 text-center">{message}</p>}
    </form>
  );
};

export default AddProductForm;