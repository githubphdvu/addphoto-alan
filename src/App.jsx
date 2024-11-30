import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import moment from 'moment'
import axios from 'axios'

const backendURL = 'https://memories-proj.onrender.com/posts'
// Redux Actions//////////////////////////////////////////////////
function getPosts() {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(backendURL)
      dispatch({ type: 'FETCH_ALL', payload: data })
    } 
    catch (error) {console.log(error.message)}
  }
}
function createPost(post) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(backendURL, post)
      dispatch({ type: 'CREATE', payload: data })
    } 
    catch (error) {console.log(error.message)}
  }
}
function updatePost(id, post) {
  return async function (dispatch) {
    try {
      const { data } = await axios.patch(`${backendURL}/${id}`, post)
      dispatch({ type: 'UPDATE', payload: data })
    } 
    catch (error) {console.log(error.message)}
  }
}
function likePost(id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.patch(`${backendURL}/${id}/likePost`)
      dispatch({ type: 'LIKE', payload: data })
    } 
    catch (error) {console.log(error.message)}
  }
}
function deletePost(id) {
  return async function (dispatch) {
    try {
      await axios.delete(`${backendURL}/${id}`)
      dispatch({ type: 'DELETE', payload: id })
    } 
    catch (error) {console.log(error.message)}
  }
}
//Components//////////////////////////////////////////////////////
function Form({ currentId, setCurrentId }) {
  const [postData, setPostData] = useState({
    creator: '',
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });
  const post = useSelector((state) =>
    currentId ? state.posts.find((message) => message._id === currentId) : null
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      creator: '',
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      dispatch(createPost(postData));
    } else {
      dispatch(updatePost(currentId, postData));
    }
    clear();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 50*1024) {
      alert('Max file size 50KB')
      return
    }
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostData((prev) => ({ ...prev, selectedFile: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto shadow-2xl rounded-lg p-6 space-y-4 mt-6"
    >
      <h2 className="text-xl font-bold text-center">
        {currentId ? `Editing "${post.title}"` : 'Create Memory Photo'}
      </h2>
      <div>
        <label className="block">Creator</label>
        <input
          type="text"
          placeholder="Your Name"
          value={postData.creator}
          onChange={(e) => setPostData({ ...postData, creator: e.target.value })}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block">Title</label>
        <input
          type="text"
          placeholder="Memory Title"
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block">Message</label>
        <textarea
          placeholder="Describe your memory"
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          rows={4}
        />
      </div>
      <div>
        <label className="block">Tags</label>
        <input
          type="text"
          placeholder="Separate tags with commas"
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div>
        <label className="block">Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="w-full bg-blue-700 py-2"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={clear}
          className="w-full bg-lime-500 py-2"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
function Post({ post, setCurrentId }) {
  const dispatch = useDispatch();

  return (
    <div className="shadow-2xl rounded-lg overflow-hidden flex flex-col h-auto min-h-[500px]">
      {/* Image Section */}
      <div className="h-64 w-full relative">
        <img
          src={post.selectedFile || 'https://via.placeholder.com/400'}
          alt=''
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content Section */}
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <button
            onClick={() => setCurrentId(post._id)}
            title="Edit Post">📝</button>
        </div>
        <p>{post.message}</p>
        <p className="text-sm italic">
          By <span className="font-medium">{post.creator}</span> •{' '}
          {moment(post.createdAt).fromNow()}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium bg-blue-200 text-blue-700 px-2 py-1 rounded-full mr-1"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Actions Section */}
      <div className="flex justify-between items-center px-4 py-2">
        <button onClick={() => dispatch(likePost(post._id))}
          className="flex items-center">👍
          <span className="ml-1">{post.likeCount}</span>
        </button>
        <button
          onClick={() => dispatch(deletePost(post._id))}
          className="flex items-center"
          title="Delete Post"
        >🗑️</button>
      </div>
    </div>
  )
}

function Posts({ setCurrentId }) {
  const posts = useSelector((state) => state.posts);

  if (!posts.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {posts.map((post) => (
        <Post key={post._id} post={post} setCurrentId={setCurrentId} />
      ))}
    </div>
  );
}
export default function App() {
  const [currentId, setCurrentId] = useState(0)
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getPosts())
  }, [currentId, dispatch])

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center py-4 shadow-2xl">
        <a href="https://projectsav.netlify.app/"><img src="./logo.jpg" alt="" className='h-14 mx-6'/></a>
        <h1 className="text-4xl font-bold">Memory Photos</h1>
        <nav className="flex items-center">
          <a href="#" className="mr-4">Login</a>
          <a href="#" className="m-5">Signup</a>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Form currentId={currentId} setCurrentId={setCurrentId} />
        <Posts setCurrentId={setCurrentId} />
      </main>
    </div>
  );
}