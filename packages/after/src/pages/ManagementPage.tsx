import React from "react";
import { Button } from "../components/ui/button";
import { Alert, Table, Modal, Card } from "../components/organisms";
import { FormInput, FormSelect, FormTextarea } from "../components/molecules";
import { useManagementPage } from "../hooks/useManagementPage";
import { getUserTableColumns, getPostTableColumns } from "../lib/table-columns";
import type { Post } from "../services/postService";

/**
 * ManagementPage 컴포넌트
 * 
 * 뷰와 비즈니스 로직이 완전히 분리된 페이지 컴포넌트입니다.
 * 모든 비즈니스 로직은 useManagementPage 훅에서 관리됩니다.
 */
export const ManagementPage: React.FC = () => {
  const {
    // State
    entityType,
    data,
    isCreateModalOpen,
    isEditModalOpen,
    selectedItem,
    showSuccessAlert,
    alertMessage,
    showErrorAlert,
    errorMessage,
    userFormData,
    postFormData,
    stats,

    // Actions
    setEntityType,
    setIsCreateModalOpen,
    setIsEditModalOpen,
    setSelectedItem,
    setShowSuccessAlert,
    setShowErrorAlert,
    setUserFormData,
    setPostFormData,
    handleCreate,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleStatusAction,
  } = useManagementPage();

  const tableColumns = entityType === "user" ? getUserTableColumns() : getPostTableColumns();

  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)]">
      <div className="max-w-[1200px] mx-auto p-5">
        <div className="mb-5">
          <h1 className="text-2xl font-bold mb-1 text-[var(--color-text-primary)]">
            관리 시스템
          </h1>
          <p className="text-[var(--color-text-tertiary)] text-sm">
            사용자와 게시글을 관리하세요
          </p>
        </div>

        <Card variant="default">
          <div className="mb-4 border-b-2 border-[var(--color-border-secondary)] pb-2">
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
              <div className="p-3 bg-[var(--color-info-bg)] border border-[var(--color-info-border)] rounded-sm">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
                  전체
                </div>
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  {stats.total}
                </div>
              </div>

              <div className="p-3 bg-[var(--color-alert-success-bg)] border border-[var(--color-alert-success-border)] rounded-sm">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
                  {stats.stat1.label}
                </div>
                <div className="text-2xl font-bold text-[var(--color-success)]">
                  {stats.stat1.value}
                </div>
              </div>

              <div className="p-3 bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] rounded-sm">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
                  {stats.stat2.label}
                </div>
                <div className="text-2xl font-bold text-[var(--color-warning)]">
                  {stats.stat2.value}
                </div>
              </div>

              <div className="p-3 bg-[var(--color-alert-error-bg)] border border-[var(--color-alert-error-border)] rounded-sm">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
                  {stats.stat3.label}
                </div>
                <div className="text-2xl font-bold text-[var(--color-danger)]">
                  {stats.stat3.value}
                </div>
              </div>

              <div className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-sm">
                <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
                  {stats.stat4.label}
                </div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stats.stat4.value}
                </div>
              </div>
            </div>

            <div className="border border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] overflow-auto rounded-sm">
              <Table
                columns={tableColumns}
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
