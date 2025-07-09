import React, { useEffect, useRef, useState } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';

const AddCourses = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters[chapters.length - 1].chapterOrder + 1
              : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = chapter.chapterContent.filter(
              (_, idx) => idx !== lectureIndex
            );
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent[chapter.chapterContent.length - 1]
                    .lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const description = quillRef.current?.root?.innerHTML || '';
    const formData = {
      title: courseTitle,
      price: coursePrice,
      discount,
      image,
      description,
      chapters,
    };
    console.log(formData);
    // TODO: send course data to API
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto p-6 bg-gray-50 text-gray-700">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 max-w-3xl mx-auto w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Add New Course</h1>

        {/* Course Title */}
        <div>
          <label className="block font-medium mb-1">Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type course title here"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Course Description</label>
          <div
            ref={editorRef}
            className="bg-white rounded border min-h-[150px] w-full p-2"
          />
        </div>

        {/* Price / Discount / Thumbnail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Discount %</label>
            <input
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder="0"
              min={0}
              max={100}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Thumbnail</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="w-8 h-8 bg-blue-500 rounded p-1"
              />
              <span>Upload Thumbnail</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                className="w-24 h-24 rounded object-cover mt-2"
              />
            )}
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Chapters</h2>
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.chapterId}
              className="bg-white border rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-center p-3 border-b bg-gray-100">
                <div className="flex items-center gap-2">
                  <img
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`cursor-pointer transition-transform ${
                      !chapter.collapsed ? 'rotate-90' : ''
                    }`}
                  />
                  <span className="font-medium">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-sm">{chapter.chapterContent.length} Lectures</span>
                  <img
                    src={assets.cross_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={() => handleChapter('remove', chapter.chapterId)}
                  />
                </div>
              </div>

              {!chapter.collapsed && (
                <div className="p-3 space-y-2">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lecture.lectureId}
                      className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                    >
                      <div>
                        {lectureIndex + 1}. {lecture.lectureTitle} -{' '}
                        {lecture.lectureDuration} mins -{' '}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline"
                        >
                          Link
                        </a>{' '}
                        {lecture.isPreviewFree && (
                          <span className="ml-2 text-green-600">
                            Free Preview
                          </span>
                        )}
                      </div>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer w-4"
                        onClick={() =>
                          handleLecture('remove', chapter.chapterId, lectureIndex)
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="w-full bg-blue-100 text-blue-700 py-2 rounded mt-2"
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </button>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 self-start"
        >
          ADD COURSE
        </button>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-semibold mb-4">Add Lecture</h3>

            <input
              type="text"
              placeholder="Title"
              className="w-full border rounded px-2 py-1 mb-2"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Duration (mins)"
              className="w-full border rounded px-2 py-1 mb-2"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Lecture URL"
              className="w-full border rounded px-2 py-1 mb-2"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
              }
            />
            <label className="flex items-center gap-2 mb-4 text-sm">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: e.target.checked,
                  })
                }
              />
              Free Preview
            </label>

            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={addLecture}
            >
              Add
            </button>

            <img
              src={assets.cross_icon}
              alt=""
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 w-4 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourses;
