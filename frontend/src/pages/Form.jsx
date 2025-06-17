import React, { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';

import { X, Mic, Paperclip, RefreshCw } from 'lucide-react';
import './Form.css';
import Navbar from '../components/Navbar'; // Import your existing Navbar component

const BugReportPage = () => {
  const API_KEY = "AIzaSyAO2AUhz4702-H64lgop9WILWfLVdAr5Rg";
  const [loading, setLoading] = useState(false);
  const [websiteURL, setWebsiteURL] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    website: '',
    government: '',
    department: '',
    bugType: '',
    description: '',
    aiDescription: '',
    tags: ['Login error', 'Performance'],
    file: null
  });
  const [listening, setListening] = useState(false);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  // At the top of your file
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

   //mic habdle
  
   

   const handleMicClick = () => {
     if (!recognition) {
       alert('Speech recognition not supported in this browser.');
       return;
     }
   
     if (!listening) {
       recognition.start();
       setListening(true);
   
       recognition.onresult = (event) => {
         const speechToText = event.results[event.resultIndex][0].transcript;
         setFormData(prev => ({
           ...prev,
           description: prev.description + ' ' + speechToText
         }));
       };
   
       recognition.onerror = (event) => {
         console.error('Speech recognition error:', event.error);
         setListening(false);
       };
   
       recognition.onend = () => {
         setListening(false);
       };
     } else {
       recognition.stop();
       setListening(false);
     }
   };
   
   
  // Handle website URL analysis
  const analyzeWebsite = async () => {
    if (!websiteURL.trim()) {
      alert("Please enter a website URL.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Classify this government website: ${websiteURL}.\n\nReturn the response in JSON with:\n- government_type: 'Central Government' or 'State Government'\n- department: Name of the department`
                }
              ]
            }
          ]
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      let textResponse = response.data.candidates[0].content.parts[0].text;

      // Clean code block if wrapped in markdown
      if (textResponse.startsWith("```json") || textResponse.startsWith("```")) {
        textResponse = textResponse.replace(/```json|```/g, '').trim();
      }
  
      // Parse the cleaned JSON
      const jsonResponse = JSON.parse(textResponse);
      // Update form data
      setFormData({
        ...formData,
        website: websiteURL,
        government: jsonResponse.government_type,
        department: jsonResponse.department
      });
      
    } catch (error) {
      console.error("Error analyzing website:", error);
      alert("Failed to analyze website. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Remove tag
  const addTag = (newTag) => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
    }
  };

  // Handle removing a tag
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };
  
  // Handle file upload (only one file allowed)
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  setFormData({ ...formData, file });

  if (file && file.type.startsWith('image/')) {
    // Convert image to base64 for Tesseract
    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result;

      try {
        const result = await Tesseract.recognize(imageData, 'eng');
        const extractedText = result.data.text;

        // OPTIONAL: Use AI to generate a short description
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Extract and summarize the issue from the following text:\n\n"${extractedText}"\n\nRespond in a single sentence.`
                  }
                ]
              }
            ]
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        let summary = geminiResponse.data.candidates[0].content.parts[0].text;
        setFormData(prev => ({
          ...prev,
          aiDescription: summary
        }));
      } catch (error) {
        console.error('OCR or AI analysis failed:', error);
        alert('Could not analyze image.');
      }
    };
    reader.readAsDataURL(file);
  }
};


// Submit form data
const handleSubmit = async (e) => {
  e.preventDefault();

  const submitData = new FormData();

  // Append all form fields to FormData
  Object.keys(formData).forEach(key => {
    if (key === 'tags') {
      submitData.append('tags', JSON.stringify(formData.tags)); // Ensure tags are stringified array
    } else if (key === 'file') {
      if (formData.file) {
        submitData.append('file', formData.file); // Only one file
      }
    } else {
      submitData.append(key, formData[key]);
    }
  });

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
  'http://localhost:5000/api/issues/submit',
  submitData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    alert('Bug report submitted successfully!');
    
    // Reset form
    setFormData({
      title: '',
      website: '',
      government: '',
      department: '',
      bugType: '',
      description: '',
      aiDescription: '',
      tags: ['Login error', 'Performance'],
      file: null
    });
    setWebsiteURL('');

  } catch (error) {
    console.error('Error submitting bug report:', error);
    alert('Failed to submit bug report. Please try again.');
  }
};

  
  return (
    <div className="page-container">
      {/* Use your existing Navbar component */}
     
      
      {/* Modal-like centered content */}
      <div className="page-content">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Report Bug</h2>
            <button className="close-button">
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Bug/Issue Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Lorem Epsiun"
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="websiteURL">Website URL</label>
              <input
                type="text"
                id="websiteURL"
                value={websiteURL}
                onChange={(e) => setWebsiteURL(e.target.value)}
                placeholder="https://"
                required
                className="form-control"
                onBlur={analyzeWebsite}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="government">Government</label>
                <input
                  type="text"
                  id="government"
                  name="government"
                  value={formData.government}
                  onChange={handleChange}
                  placeholder="State/Central"
                  readOnly
                  className="form-control"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  readOnly
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                 
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bugType">Bug Type</label>
              <div className="select-wrapper">
                <select
                  id="bugType"
                  name="bugType"
                  value={formData.bugType}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Bug Type</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Performance">Performance</option>
                  <option value="Functionality">Functionality</option>
                  <option value="Security">Security</option>
                  <option value="Accessibility">Accessibility</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <div className="textarea-container">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description of task.."
                  required
                  className="form-control"
                ></textarea>
                <div className="textarea-icons">
                  <button type="button" onClick={handleMicClick} className="icon-button">
                    
                    {listening ? '🛑' :<Mic size={16} /> }
                  </button>
                  <button type="button" className="icon-button">
                    <Paperclip size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="aiDescription">AI Description</label>
                <div className="textarea-container">
                  <textarea
                    id="aiDescription"
                    name="aiDescription"
                    value={formData.aiDescription}
                    onChange={handleChange}
                    placeholder="Generated"
                    className="form-control"
                    readOnly
                  ></textarea>
                  <div className="textarea-icons">
                    <button type="button" className="icon-button refresh-icon">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="files">Upload Files</label>
                <div className="file-upload-container">
                  <label htmlFor="fileUpload" className="file-upload-label">
                    <Paperclip size={16} />
                    <span>Add supporting files</span>
                  </label>
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    multiple
                    name="file"
                    className="file-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
      <label htmlFor="tags">Tags</label>
      <div className="tags-container">
        {formData.tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
            <button
              type="button"
              className="tag-close"
              onClick={() => removeTag(tag)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      {/* Add Tag Input */}
      <div className="add-tag-container">
        <input
          type="text"
          id="newTag"
          placeholder="Add a tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTag(e.target.value);
              e.target.value = ""; // Clear input after adding
            }
          }}
        />
      </div>
    </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">Submit Bug</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BugReportPage;