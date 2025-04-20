import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Form, Button, ListGroup, Modal, Alert, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Forum() {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [editCommentContent, setEditCommentContent] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null); // State để lưu chủ đề được chọn
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [error, setError] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchTopics = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/topics`, {
        params: { page: currentPage, limit: 6 },
      });
      const topicsData = response.data.topics;
      const detailedTopics = await Promise.all(
        topicsData.map(async (topic) => {
          const topicDetail = await axios.get(`http://localhost:5000/api/topics/${topic._id}`);
          return topicDetail.data;
        })
      );
      setTopics(detailedTopics);
      setCurrentPage(parseInt(response.data.currentPage, 10));
      setTotalPages(parseInt(response.data.totalPages, 10));
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err.response?.data.message || 'Không thể tải danh sách chủ đề.');
    }
  }, [currentPage]);

  useEffect(() => {
    fetchTopics();
  }, [currentPage, fetchTopics]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedTopicId(topic._id);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedTopicId(null);
  };

  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/topics', {
        title,
        description,
        user: JSON.stringify(user),
      });

      const newTopic = response.data;
      setTopics([newTopic, ...topics]);
      setTitle('');
      setDescription('');
      setShowTopicModal(false);
      fetchTopics();
    } catch (err) {
      setError(err.response?.data.message || 'Không thể tạo chủ đề.');
    }
  };

  const handleEditTopic = async (topicId) => {
    setError(null);

    try {
      const response = await axios.put(`http://localhost:5000/api/topics/${topicId}`, {
        title,
        description,
        user: JSON.stringify(user),
      });

      setTopics(topics.map((t) => (t._id === topicId ? response.data : t)));
      setTitle('');
      setDescription('');
      setShowEditTopicModal(false);
      fetchTopics();
    } catch (err) {
      setError(err.response?.data.message || 'Không thể sửa chủ đề.');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await axios.delete(`http://localhost:5000/api/topics/${topicId}`, {
        data: { user: JSON.stringify(user) },
      });

      setTopics(topics.filter((topic) => topic._id !== topicId));
      fetchTopics();
      setSelectedTopic(null); // Quay lại danh sách chủ đề nếu chủ đề đang xem bị xóa
    } catch (err) {
      setError(err.response?.data.message || 'Không thể xóa chủ đề.');
    }
  };

  const handleSubmitPost = async (topicId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/topics/${topicId}/posts`, {
        title: postTitle,
        content: postContent,
        user,
      });

      const newPost = response.data;
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? { ...topic, posts: [...(topic.posts || []), newPost] }
            : topic
        )
      );
      setSelectedTopic((prevTopic) =>
        prevTopic._id === topicId
          ? { ...prevTopic, posts: [...(prevTopic.posts || []), newPost] }
          : prevTopic
      );
      setPostTitle('');
      setPostContent('');
      setShowPostModal(false);
    } catch (err) {
      setError(err.response?.data.message || 'Không thể tạo bài viết.');
    }
  };

  const handleIncrementView = async (topicId, postId) => {
    try {
      await axios.post(`http://localhost:5000/api/topics/${topicId}/posts/${postId}/view`);
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? {
                ...topic,
                posts: topic.posts.map((post) =>
                  post._id === postId ? { ...post, views: (post.views || 0) + 1 } : post
                ),
              }
            : topic
        )
      );
      setSelectedTopic((prevTopic) =>
        prevTopic && prevTopic._id === topicId
          ? {
              ...prevTopic,
              posts: prevTopic.posts.map((post) =>
                post._id === postId ? { ...post, views: (post.views || 0) + 1 } : post
              ),
            }
          : prevTopic
      );
    } catch (err) {
      console.error('Error incrementing view:', err);
    }
  };

  const handleSubmitComment = async (topicId, postId, parentCommentId = null) => {
    try {
      const plainUser = JSON.parse(JSON.stringify(user));
      console.log('Submitting comment with data:', {
        content: commentContent,
        topicId,
        postId,
        parentCommentId,
        user: plainUser,
      });
      const response = await axios.post('http://localhost:5000/api/comments', {
        content: commentContent,
        topicId,
        postId,
        parentCommentId,
        user: plainUser,
      });

      const newComment = response.data;
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? {
                ...topic,
                posts: topic.posts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        comments: parentCommentId
                          ? post.comments.map((c) =>
                              c._id === parentCommentId
                                ? { ...c, replies: [...(c.replies || []), newComment] }
                                : c
                            )
                          : [...(post.comments || []), newComment],
                      }
                    : post
                ),
              }
            : topic
        )
      );
      setSelectedTopic((prevTopic) =>
        prevTopic && prevTopic._id === topicId
          ? {
              ...prevTopic,
              posts: prevTopic.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      comments: parentCommentId
                        ? post.comments.map((c) =>
                            c._id === parentCommentId
                              ? { ...c, replies: [...(c.replies || []), newComment] }
                              : c
                          )
                        : [...(post.comments || []), newComment],
                    }
                  : post
              ),
            }
          : prevTopic
      );
      setCommentContent('');
      setShowCommentModal(false);
    } catch (err) {
      setError(err.response?.data.message || 'Không thể thêm bình luận.');
    }
  };

  const handleEditComment = async (topicId, postId, commentId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/comments/${commentId}`, {
        content: editCommentContent,
        user,
      });

      const updatedComment = response.data;
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? {
                ...topic,
                posts: topic.posts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        comments: (post.comments || []).map((c) => {
                          if (c._id === commentId) return updatedComment;
                          return {
                            ...c,
                            replies: (c.replies || []).map((r) =>
                              r._id === commentId ? updatedComment : r
                            ),
                          };
                        }),
                      }
                    : post
                ),
              }
            : topic
        )
      );
      setSelectedTopic((prevTopic) =>
        prevTopic && prevTopic._id === topicId
          ? {
              ...prevTopic,
              posts: prevTopic.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      comments: (post.comments || []).map((c) => {
                        if (c._id === commentId) return updatedComment;
                        return {
                          ...c,
                          replies: (c.replies || []).map((r) =>
                            r._id === commentId ? updatedComment : r
                          ),
                        };
                      }),
                    }
                  : post
              ),
            }
          : prevTopic
      );
      setEditCommentContent('');
      setShowEditCommentModal(false);
    } catch (err) {
      setError(err.response?.data.message || 'Không thể sửa bình luận.');
    }
  };

  const handleDeleteComment = async (topicId, postId, commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        data: { user },
      });

      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic._id === topicId
            ? {
                ...topic,
                posts: topic.posts.map((post) =>
                  post._id === postId
                    ? {
                        ...post,
                        comments: (post.comments || []).filter((c) => c._id !== commentId).map((c) => ({
                          ...c,
                          replies: (c.replies || []).filter((r) => r._id !== commentId),
                        })),
                      }
                    : post
                ),
              }
            : topic
        )
      );
      setSelectedTopic((prevTopic) =>
        prevTopic && prevTopic._id === topicId
          ? {
              ...prevTopic,
              posts: prevTopic.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      comments: (post.comments || []).filter((c) => c._id !== commentId).map((c) => ({
                        ...c,
                        replies: (c.replies || []).filter((r) => r._id !== commentId),
                      })),
                    }
                  : post
              ),
            }
          : prevTopic
      );
    } catch (err) {
      setError(err.response?.data.message || 'Không thể xóa bình luận.');
    }
  };

  const getCommentCountForPost = (post) => {
    const comments = post.comments || [];
    const commentCount = comments.length;
    const replyCount = comments.reduce((acc, comment) => acc + (comment.replies || []).length, 0);
    return commentCount + replyCount;
  };

  const getCommentCountForTopic = (topic) => {
    return (topic.posts || []).reduce((acc, post) => acc + getCommentCountForPost(post), 0);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #b3b6ff, #7a7dff)', minHeight: '100vh', padding: '20px 0' }}>
      <Container>
        <h1 className="text-center mb-4" style={{ color: '#fff' }}>Chủ đề nóng hôm nay</h1>
        {error && <Alert variant="danger">{error}</Alert>}

        {!selectedTopic ? (
          <>
            <Button
              onClick={() => setShowTopicModal(true)}
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
                marginBottom: '20px',
              }}
            >
              Tạo chủ đề mới
            </Button>

            {topics.length === 0 ? (
              <p style={{ color: '#fff' }}>Không có chủ đề nào.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '20px',
              }}>
                {topics.map((topic) => (
                  <Card key={topic._id} style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                      <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{topic.title}</Card.Title>
                      <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>{topic.description}</Card.Text>
                      <Card.Text style={{ fontSize: '0.85rem', color: '#777' }}>
                        Đăng bởi: {topic.author?.name || 'Unknown'}<br />
                        Ngày tạo: {new Date(topic.createdAt).toLocaleDateString()}<br />
                        Lượt xem: {(topic.posts || []).reduce((acc, post) => acc + (post.views || 0), 0)}
                      </Card.Text>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Button
                          onClick={() => handleSelectTopic(topic)}
                          style={{
                            background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                            border: 'none',
                            fontSize: '0.9rem',
                            padding: '5px 10px',
                          }}
                        >
                          Tham gia
                        </Button>
                        {(topic.author.id === user.id || user.role === 'admin') && (
                          <>
                            <Button
                              variant="warning"
                              onClick={() => {
                                setSelectedTopicId(topic._id);
                                setTitle(topic.title);
                                setDescription(topic.description);
                                setShowEditTopicModal(true);
                              }}
                              style={{ fontSize: '0.9rem', padding: '5px 10px' }}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteTopic(topic._id)}
                              style={{ fontSize: '0.9rem', padding: '5px 10px' }}
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}

            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => setCurrentPage((prev) => Math.max(parseInt(prev, 10) - 1, 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === parseInt(currentPage, 10)}
                  onClick={() => setCurrentPage(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage((prev) => Math.min(parseInt(prev, 10) + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </>
        ) : (
          <div>
            <Button
              variant="secondary"
              onClick={handleBackToTopics}
              style={{ marginBottom: '20px' }}
            >
              Quay lại
            </Button>
            <Card style={{ borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedTopic.title}</h3>
                    <p style={{ fontSize: '1rem', color: '#555' }}>{selectedTopic.description}</p>
                    <p style={{ fontSize: '0.85rem', color: '#777' }}>
                      Đăng bởi: {selectedTopic.author?.name || 'Unknown'}<br />
                      Ngày tạo: {new Date(selectedTopic.createdAt).toLocaleDateString()}<br />
                      Lượt xem: {(selectedTopic.posts || []).reduce((acc, post) => acc + (post.views || 0), 0)}<br />
                      Số bình luận: {getCommentCountForTopic(selectedTopic)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPostModal(true)}
                  style={{
                    background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                    border: 'none',
                    marginTop: '10px',
                    marginBottom: '20px',
                  }}
                >
                  Thêm bài viết
                </Button>

                <hr />
                {(selectedTopic.posts || []).length === 0 ? (
                  <p>Không có bài viết nào.</p>
                ) : (
                  selectedTopic.posts.map((post) => (
                    <div key={post._id} className="mb-3">
                      <h5>{post.title}</h5>
                      <p>{post.content}</p>
                      <p style={{ fontSize: '0.85rem', color: '#777' }}>
                        Tác giả: {post.author?.name || 'Unknown'}<br />
                        Lượt xem: {post.views || 0}
                      </p>
                      <Button
                        onClick={() => {
                          handleIncrementView(selectedTopic._id, post._id);
                          setSelectedPostId(post._id);
                          setShowCommentModal(true);
                        }}
                        style={{
                          background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                          border: 'none',
                        }}
                      >
                        Thêm bình luận
                      </Button>
                      {(post.comments || []).map((comment) => (
                        <ListGroup.Item key={comment._id} className="mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{comment.author?.name || 'Unknown'}:</strong> {comment.content}
                              <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
                            </div>
                            <div>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedTopicId(selectedTopic._id);
                                  setSelectedPostId(post._id);
                                  setSelectedCommentId(comment._id);
                                  setShowCommentModal(true);
                                }}
                                className="me-2"
                              >
                                Trả lời
                              </Button>
                              {comment.author.id === user.id && (
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTopicId(selectedTopic._id);
                                    setSelectedPostId(post._id);
                                    setSelectedCommentId(comment._id);
                                    setEditCommentContent(comment.content);
                                    setShowEditCommentModal(true);
                                  }}
                                  className="me-2"
                                >
                                  Sửa
                                </Button>
                              )}
                              {(comment.author.id === user.id || user.role === 'admin') && !(user.role === 'student' && comment.author.role === 'admin') && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDeleteComment(selectedTopic._id, post._id, comment._id)}
                                >
                                  Xóa
                                </Button>
                              )}
                            </div>
                          </div>
                          {(comment.replies || []).map((reply) => (
                            <ListGroup.Item key={reply._id} className="ms-4 mt-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{reply.author?.name || 'Unknown'}:</strong> {reply.content}
                                  <p><small>{new Date(reply.createdAt).toLocaleString()}</small></p>
                                </div>
                                <div>
                                  {reply.author.id === user.id && (
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTopicId(selectedTopic._id);
                                        setSelectedPostId(post._id);
                                        setSelectedCommentId(reply._id);
                                        setEditCommentContent(reply.content);
                                        setShowEditCommentModal(true);
                                      }}
                                      className="me-2"
                                    >
                                      Sửa
                                    </Button>
                                  )}
                                  {(reply.author.id === user.id || user.role === 'admin') && !(user.role === 'student' && reply.author.role === 'admin') && (
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteComment(selectedTopic._id, post._id, reply._id)}
                                    >
                                      Xóa
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup.Item>
                      ))}
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>
          </div>
        )}

        <Modal show={showTopicModal} onHide={() => setShowTopicModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Tạo chủ đề mới</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmitTopic}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                style={{
                  background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                  border: 'none',
                }}
              >
                Đăng chủ đề
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showEditTopicModal} onHide={() => setShowEditTopicModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sửa chủ đề</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); handleEditTopic(selectedTopicId); }}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                style={{
                  background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                  border: 'none',
                }}
              >
                Lưu
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm bài viết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Tiêu đề bài viết"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nội dung bài viết"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPostModal(false)}>
              Đóng
            </Button>
            <Button
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
              }}
              onClick={() => handleSubmitPost(selectedTopicId)}
            >
              Gửi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCommentId ? 'Trả lời bình luận' : 'Thêm bình luận'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập bình luận của bạn"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
              Đóng
            </Button>
            <Button
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
              }}
              onClick={() => handleSubmitComment(selectedTopicId, selectedPostId, selectedCommentId)}
            >
              Gửi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditCommentModal} onHide={() => setShowEditCommentModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Chỉnh sửa bình luận</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditCommentModal(false)}>
              Đóng
            </Button>
            <Button
              style={{
                background: 'linear-gradient(90deg, #7a7dff, #b3b6ff)',
                border: 'none',
              }}
              onClick={() => handleEditComment(selectedTopicId, selectedPostId, selectedCommentId)}
            >
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Forum;