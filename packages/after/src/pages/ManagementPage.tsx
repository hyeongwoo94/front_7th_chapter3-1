import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Alert, Table, Modal, Card } from "../components/organisms";
import { FormInput, FormSelect, FormTextarea } from "../components/molecules";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type EntityType = "user" | "post";
type Entity = User | Post;

type UserFormData = {
  username?: string;
  email?: string;
  role?: "admin" | "moderator" | "user";
  status?: "active" | "inactive" | "suspended";
};

type PostFormData = {
  title?: string;
  content?: string;
  author?: string;
  category?: string;
  status?: "draft" | "published" | "archived";
};

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>("post");
  const [data, setData] = useState<Entity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userFormData, setUserFormData] = useState<UserFormData>({});
  const [postFormData, setPostFormData] = useState<PostFormData>({});

  const loadData = useCallback(async () => {
    try {
      let result: Entity[];

      if (entityType === "user") {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch {
      setErrorMessage("데이터를 불러오는데 실패했습니다");
      setShowErrorAlert(true);
    }
  }, [entityType]);

  useEffect(() => {
    loadData();
    setUserFormData({});
    setPostFormData({});
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, [entityType, loadData]);

  const handleCreate = async () => {
    try {
      if (entityType === "user") {
        if (!userFormData.username || !userFormData.email) {
          throw new Error("사용자명과 이메일은 필수입니다");
        }
        await userService.create({
          username: userFormData.username,
          email: userFormData.email,
          role: userFormData.role || "user",
          status: userFormData.status || "active",
        });
      } else {
        if (
          !postFormData.title ||
          !postFormData.author ||
          !postFormData.category
        ) {
          throw new Error("제목, 작성자, 카테고리는 필수입니다");
        }
        await postService.create({
          title: postFormData.title,
          content: postFormData.content || "",
          author: postFormData.author,
          category: postFormData.category,
          status: postFormData.status || "draft",
        });
      }

      await loadData();
      setIsCreateModalOpen(false);
      setUserFormData({});
      setPostFormData({});
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 생성되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "생성에 실패했습니다";
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (item: Entity) => {
    setSelectedItem(item);

    if (entityType === "user") {
      const user = item as User;
      setUserFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      const post = item as Post;
      setPostFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
      });
    }

    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      if (entityType === "user") {
        await userService.update(selectedItem.id, userFormData);
      } else {
        await postService.update(selectedItem.id, postFormData);
      }

      await loadData();
      setIsEditModalOpen(false);
      setUserFormData({});
      setPostFormData({});
      setSelectedItem(null);
      setAlertMessage(
        `${entityType === "user" ? "사용자" : "게시글"}가 수정되었습니다`
      );
      setShowSuccessAlert(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "수정에 실패했습니다";
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      if (entityType === "user") {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }

      await loadData();
      setAlertMessage("삭제되었습니다");
      setShowSuccessAlert(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "삭제에 실패했습니다";
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
  };

  const handleStatusAction = async (
    id: number,
    action: "publish" | "archive" | "restore"
  ) => {
    if (entityType !== "post") return;

    try {
      if (action === "publish") {
        await postService.publish(id);
      } else if (action === "archive") {
        await postService.archive(id);
      } else if (action === "restore") {
        await postService.restore(id);
      }

      await loadData();
      const message =
        action === "publish" ? "게시" : action === "archive" ? "보관" : "복원";
      setAlertMessage(`${message}되었습니다`);
      setShowSuccessAlert(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "작업에 실패했습니다";
      setErrorMessage(errorMessage);
      setShowErrorAlert(true);
    }
  };

  const getStats = () => {
    if (entityType === "user") {
      const users = data as User[];
      return {
        total: users.length,
        stat1: {
          label: "활성",
          value: users.filter((u) => u.status === "active").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "비활성",
          value: users.filter((u) => u.status === "inactive").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "정지",
          value: users.filter((u) => u.status === "suspended").length,
          color: "#d32f2f",
        },
        stat4: {
          label: "관리자",
          value: users.filter((u) => u.role === "admin").length,
          color: "#1976d2",
        },
      };
    } else {
      const posts = data as Post[];
      return {
        total: posts.length,
        stat1: {
          label: "게시됨",
          value: posts.filter((p) => p.status === "published").length,
          color: "#2e7d32",
        },
        stat2: {
          label: "임시저장",
          value: posts.filter((p) => p.status === "draft").length,
          color: "#ed6c02",
        },
        stat3: {
          label: "보관됨",
          value: posts.filter((p) => p.status === "archived").length,
          color: "rgba(0, 0, 0, 0.6)",
        },
        stat4: {
          label: "총 조회수",
          value: posts.reduce((sum, p) => sum + p.views, 0),
          color: "#1976d2",
        },
      };
    }
  };

  // 🚨 Table 컴포넌트에 로직을 위임하여 간소화
  const renderTableColumns = () => {
    if (entityType === "user") {
      return [
        { key: "id", header: "ID", width: "60px" },
        { key: "username", header: "사용자명", width: "150px" },
        { key: "email", header: "이메일" },
        { key: "role", header: "역할", width: "120px" },
        { key: "status", header: "상태", width: "120px" },
        { key: "createdAt", header: "생성일", width: "120px" },
        { key: "lastLogin", header: "마지막 로그인", width: "140px" },
        { key: "actions", header: "관리", width: "200px" },
      ];
    } else {
      return [
        { key: "id", header: "ID", width: "60px" },
        { key: "title", header: "제목" },
        { key: "author", header: "작성자", width: "120px" },
        { key: "category", header: "카테고리", width: "140px" },
        { key: "status", header: "상태", width: "120px" },
        { key: "views", header: "조회수", width: "100px" },
        { key: "createdAt", header: "작성일", width: "120px" },
        { key: "actions", header: "관리", width: "250px" },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1200px] mx-auto p-5">
        <div className="mb-5">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">관리 시스템</h1>
          <p className="text-gray-600 text-sm">사용자와 게시글을 관리하세요</p>
        </div>

        <Card variant="default">
          <div className="mb-4 border-b-2 border-gray-300 pb-2">
            <div className="flex gap-2">
              <Button
                variant={entityType === "post" ? "primary" : "secondary"}
                size="default"
                onClick={() => setEntityType("post")}
              >
                게시글
              </Button>
              <Button
                variant={entityType === "user" ? "primary" : "secondary"}
                size="default"
                onClick={() => setEntityType("user")}
              >
                사용자
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-4 text-right">
              <Button
                variant="primary"
                size="default"
                onClick={() => setIsCreateModalOpen(true)}
              >
                새로 만들기
              </Button>
            </div>

            {showSuccessAlert && (
              <div className="mb-2">
                <Alert
                  variant="success"
                  title="성공"
                  onClose={() => setShowSuccessAlert(false)}
                >
                  {alertMessage}
                </Alert>
              </div>
            )}

            {showErrorAlert && (
              <div className="mb-2">
                <Alert
                  variant="error"
                  title="오류"
                  onClose={() => setShowErrorAlert(false)}
                >
                  {errorMessage}
                </Alert>
              </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mb-4">
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-sm">
                <div className="text-xs text-gray-600 mb-1">전체</div>
                <div className="text-2xl font-bold text-blue-700">
                  {stats.total}
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-400 rounded-sm">
                <div className="text-xs text-gray-600 mb-1">
                  {stats.stat1.label}
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {stats.stat1.value}
                </div>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-400 rounded-sm">
                <div className="text-xs text-gray-600 mb-1">
                  {stats.stat2.label}
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {stats.stat2.value}
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-300 rounded-sm">
                <div className="text-xs text-gray-600 mb-1">
                  {stats.stat3.label}
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {stats.stat3.value}
                </div>
              </div>

              <div className="p-3 bg-gray-100 border border-gray-400 rounded-sm">
                <div className="text-xs text-gray-600 mb-1">
                  {stats.stat4.label}
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {stats.stat4.value}
                </div>
              </div>
            </div>

            <div className="border border-gray-300 bg-white overflow-auto rounded-sm">
              <Table
                columns={renderTableColumns()}
                data={data}
                striped
                hover
                entityType={entityType}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={(id) => handleStatusAction(id, "publish")}
                onArchive={(id) => handleStatusAction(id, "archive")}
                onRestore={(id) => handleStatusAction(id, "restore")}
              />
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setUserFormData({});
          setPostFormData({});
        }}
        title={`새 ${entityType === "user" ? "사용자" : "게시글"} 만들기`}
        size="large"
        showFooter
        footerContent={
          <>
            <Button
              variant="secondary"
              size="default"
              onClick={() => {
                setIsCreateModalOpen(false);
                setUserFormData({});
                setPostFormData({});
              }}
            >
              취소
            </Button>
            <Button variant="primary" size="default" onClick={handleCreate}>
              생성
            </Button>
          </>
        }
      >
        <div>
          {entityType === "user" ? (
            <>
              <FormInput
                name="username"
                value={userFormData.username || ""}
                onChange={(value) =>
                  setUserFormData({ ...userFormData, username: value })
                }
                label="사용자명"
                placeholder="사용자명을 입력하세요"
                required
                width="full"
                fieldType="username"
              />
              <FormInput
                name="email"
                value={userFormData.email || ""}
                onChange={(value) =>
                  setUserFormData({ ...userFormData, email: value })
                }
                label="이메일"
                placeholder="이메일을 입력하세요"
                type="email"
                required
                width="full"
                fieldType="email"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="role"
                  value={userFormData.role || "user"}
                  onChange={(value) =>
                    setUserFormData({
                      ...userFormData,
                      role: value as "admin" | "moderator" | "user",
                    })
                  }
                  options={[
                    { value: "user", label: "사용자" },
                    { value: "moderator", label: "운영자" },
                    { value: "admin", label: "관리자" },
                  ]}
                  label="역할"
                  size="md"
                />
                <FormSelect
                  name="status"
                  value={userFormData.status || "active"}
                  onChange={(value) =>
                    setUserFormData({
                      ...userFormData,
                      status: value as "active" | "inactive" | "suspended",
                    })
                  }
                  options={[
                    { value: "active", label: "활성" },
                    { value: "inactive", label: "비활성" },
                    { value: "suspended", label: "정지" },
                  ]}
                  label="상태"
                  size="md"
                />
              </div>
            </>
          ) : (
            <>
              <FormInput
                name="title"
                value={postFormData.title || ""}
                onChange={(value) =>
                  setPostFormData({ ...postFormData, title: value })
                }
                label="제목"
                placeholder="게시글 제목을 입력하세요"
                required
                width="full"
                fieldType="postTitle"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="author"
                  value={postFormData.author || ""}
                  onChange={(value) =>
                    setPostFormData({ ...postFormData, author: value })
                  }
                  label="작성자"
                  placeholder="작성자명"
                  required
                  width="full"
                />
                <FormSelect
                  name="category"
                  value={postFormData.category || ""}
                  onChange={(value) =>
                    setPostFormData({ ...postFormData, category: value })
                  }
                  options={[
                    { value: "development", label: "Development" },
                    { value: "design", label: "Design" },
                    { value: "accessibility", label: "Accessibility" },
                  ]}
                  label="카테고리"
                  placeholder="카테고리 선택"
                  size="md"
                />
              </div>
              <FormTextarea
                name="content"
                value={postFormData.content || ""}
                onChange={(value) =>
                  setPostFormData({ ...postFormData, content: value })
                }
                label="내용"
                placeholder="게시글 내용을 입력하세요"
                rows={6}
              />
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setUserFormData({});
          setPostFormData({});
          setSelectedItem(null);
        }}
        title={`${entityType === "user" ? "사용자" : "게시글"} 수정`}
        size="large"
        showFooter
        footerContent={
          <>
            <Button
              variant="secondary"
              size="default"
              onClick={() => {
                setIsEditModalOpen(false);
                setUserFormData({});
                setPostFormData({});
                setSelectedItem(null);
              }}
            >
              취소
            </Button>
            <Button variant="primary" size="default" onClick={handleUpdate}>
              수정 완료
            </Button>
          </>
        }
      >
        <div>
          {selectedItem && (
            <Alert variant="info">
              ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
              {entityType === "post" &&
                ` | 조회수: ${(selectedItem as Post).views}`}
            </Alert>
          )}

          {entityType === "user" ? (
            <>
              <FormInput
                name="username"
                value={userFormData.username || ""}
                onChange={(value) =>
                  setUserFormData({ ...userFormData, username: value })
                }
                label="사용자명"
                placeholder="사용자명을 입력하세요"
                required
                width="full"
                fieldType="username"
              />
              <FormInput
                name="email"
                value={userFormData.email || ""}
                onChange={(value) =>
                  setUserFormData({ ...userFormData, email: value })
                }
                label="이메일"
                placeholder="이메일을 입력하세요"
                type="email"
                required
                width="full"
                fieldType="email"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  name="role"
                  value={userFormData.role || "user"}
                  onChange={(value) =>
                    setUserFormData({
                      ...userFormData,
                      role: value as "admin" | "moderator" | "user",
                    })
                  }
                  options={[
                    { value: "user", label: "사용자" },
                    { value: "moderator", label: "운영자" },
                    { value: "admin", label: "관리자" },
                  ]}
                  label="역할"
                  size="md"
                />
                <FormSelect
                  name="status"
                  value={userFormData.status || "active"}
                  onChange={(value) =>
                    setUserFormData({
                      ...userFormData,
                      status: value as "active" | "inactive" | "suspended",
                    })
                  }
                  options={[
                    { value: "active", label: "활성" },
                    { value: "inactive", label: "비활성" },
                    { value: "suspended", label: "정지" },
                  ]}
                  label="상태"
                  size="md"
                />
              </div>
            </>
          ) : (
            <>
              <FormInput
                name="title"
                value={postFormData.title || ""}
                onChange={(value) =>
                  setPostFormData({ ...postFormData, title: value })
                }
                label="제목"
                placeholder="게시글 제목을 입력하세요"
                required
                width="full"
                fieldType="postTitle"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="author"
                  value={postFormData.author || ""}
                  onChange={(value) =>
                    setPostFormData({ ...postFormData, author: value })
                  }
                  label="작성자"
                  placeholder="작성자명"
                  required
                  width="full"
                />
                <FormSelect
                  name="category"
                  value={postFormData.category || ""}
                  onChange={(value) =>
                    setPostFormData({ ...postFormData, category: value })
                  }
                  options={[
                    { value: "development", label: "Development" },
                    { value: "design", label: "Design" },
                    { value: "accessibility", label: "Accessibility" },
                  ]}
                  label="카테고리"
                  placeholder="카테고리 선택"
                  size="md"
                />
              </div>
              <FormTextarea
                name="content"
                value={postFormData.content || ""}
                onChange={(value) =>
                  setPostFormData({ ...postFormData, content: value })
                }
                label="내용"
                placeholder="게시글 내용을 입력하세요"
                rows={6}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
