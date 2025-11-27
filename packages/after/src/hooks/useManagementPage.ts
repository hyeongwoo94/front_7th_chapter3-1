/**
 * ManagementPage Custom Hook
 * 
 * ManagementPage의 비즈니스 로직을 관리하는 커스텀 훅입니다.
 * 뷰와 비즈니스 로직을 완전히 분리합니다.
 */

import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import { validateUserForm, validatePostForm, type UserFormData, type PostFormData } from "../lib/validation";
import { calculateUserStats, calculatePostStats } from "../lib/stats";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type EntityType = "user" | "post";
type Entity = User | Post;

export function useManagementPage() {
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
        const validation = validateUserForm(userFormData);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        await userService.create({
          username: userFormData.username!,
          email: userFormData.email!,
          role: userFormData.role || "user",
          status: userFormData.status || "active",
        });
      } else {
        const validation = validatePostForm(postFormData);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        await postService.create({
          title: postFormData.title!,
          content: postFormData.content || "",
          author: postFormData.author!,
          category: postFormData.category!,
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
        const validation = validateUserForm(userFormData);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        await userService.update(selectedItem.id, userFormData);
      } else {
        const validation = validatePostForm(postFormData);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

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
      return calculateUserStats(data as User[]);
    } else {
      return calculatePostStats(data as Post[]);
    }
  };

  return {
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
    stats: getStats(),

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
  };
}

