/**
 * 비즈니스 로직 사용 예시 코드
 * 
 * 이 파일은 비즈니스 로직을 컴포넌트에서 어떻게 사용하는지 보여주는 예시입니다.
 * 실제 프로젝트에서는 이 패턴을 참고하여 사용하세요.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  canDeleteUser, 
  canEditUser,
  canPublishPost,
  canArchivePost,
  canRestorePost,
  getButtonVariantFromAction,
  getButtonLabelFromAction,
  type User,
  type Post
} from '@/lib/business-rules';

// ============================================
// 예시 1: 간단한 권한 체크
// ============================================
export function UserActionButtons({ user }: { user: User }) {
  // ✅ 비즈니스 로직 import해서 사용
  const canDelete = canDeleteUser(user);
  const canEdit = canEditUser(user);

  return (
    <div className="flex gap-2">
      {canEdit && (
        <Button variant="primary" onClick={() => handleEdit(user)}>
          수정
        </Button>
      )}
      {canDelete && (
        <Button variant="danger" onClick={() => handleDelete(user.id)}>
          삭제
        </Button>
      )}
    </div>
  );
}

// ============================================
// 예시 2: 게시글 상태 관리
// ============================================
export function PostActionButtons({ post }: { post: Post }) {
  // ✅ 비즈니스 로직으로 액션 가능 여부 체크
  const canPublish = canPublishPost(post);
  const canArchive = canArchivePost(post);
  const canRestore = canRestorePost(post);

  return (
    <div className="flex gap-2">
      {canPublish && (
        <Button 
          variant="success" 
          onClick={() => handlePublish(post.id)}
        >
          게시
        </Button>
      )}
      {canArchive && (
        <Button 
          variant="secondary" 
          onClick={() => handleArchive(post.id)}
        >
          보관
        </Button>
      )}
      {canRestore && (
        <Button 
          variant="primary" 
          onClick={() => handleRestore(post.id)}
        >
          복원
        </Button>
      )}
    </div>
  );
}

// ============================================
// 예시 3: 버튼 Variant 자동 결정
// ============================================
export function DynamicActionButton({ 
  action, 
  entityType,
  onClick 
}: { 
  action: "create" | "edit" | "delete" | "publish" | "archive";
  entityType?: "user" | "post";
  onClick: () => void;
}) {
  // ✅ 비즈니스 로직으로 버튼 스타일과 라벨 결정
  const variant = getButtonVariantFromAction(action);
  const label = getButtonLabelFromAction(action, entityType);

  return (
    <Button variant={variant} onClick={onClick}>
      {label}
    </Button>
  );
}

// 사용 예시:
// <DynamicActionButton 
//   action="delete" 
//   onClick={handleDelete}
// />
// → variant="danger", label="삭제"

// <DynamicActionButton 
//   action="create" 
//   entityType="user"
//   onClick={handleCreate}
// />
// → variant="primary", label="새 사용자 만들기"

// ============================================
// 예시 4: Table 컴포넌트에서 사용
// ============================================
export function UserTable({ users }: { users: User[] }) {
  return (
    <table>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              {/* ✅ 비즈니스 로직으로 조건부 렌더링 */}
              {canEditUser(user) && (
                <Button size="sm" onClick={() => handleEdit(user)}>
                  수정
                </Button>
              )}
              {canDeleteUser(user) && (
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => handleDelete(user.id)}
                >
                  삭제
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================
// 예시 5: Custom Hook에서 사용
// ============================================
import { useState } from 'react';

export function useUserActions(user: User) {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 비즈니스 로직으로 권한 체크
  const canEdit = canEditUser(user);
  const canDelete = canDeleteUser(user);

  const handleEdit = async () => {
    if (!canEdit) {
      alert('수정 권한이 없습니다.');
      return;
    }
    
    setIsLoading(true);
    try {
      // 수정 로직
      await updateUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canDelete) {
      alert('삭제 권한이 없습니다.');
      return;
    }
    
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // 삭제 로직
      await deleteUser(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    canEdit,
    canDelete,
    handleEdit,
    handleDelete,
    isLoading,
  };
}

// 사용 예시:
// function UserCard({ user }: { user: User }) {
//   const { canEdit, canDelete, handleEdit, handleDelete } = useUserActions(user);
//   
//   return (
//     <div>
//       <h3>{user.name}</h3>
//       {canEdit && <Button onClick={handleEdit}>수정</Button>}
//       {canDelete && <Button variant="danger" onClick={handleDelete}>삭제</Button>}
//     </div>
//   );
// }

// ============================================
// 예시 6: 조건부 렌더링과 메시지
// ============================================
export function UserManagementCard({ user }: { user: User }) {
  const canEdit = canEditUser(user);
  const canDelete = canDeleteUser(user);

  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      
      {/* ✅ 비즈니스 로직으로 조건부 메시지 표시 */}
      {!canEdit && !canDelete && (
        <p className="text-muted">이 사용자는 관리자입니다. 수정/삭제할 수 없습니다.</p>
      )}
      
      <div className="flex gap-2">
        {canEdit && (
          <Button variant="primary" onClick={() => handleEdit(user)}>
            수정
          </Button>
        )}
        {canDelete && (
          <Button variant="danger" onClick={() => handleDelete(user.id)}>
            삭제
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================
// 더미 핸들러 함수들 (실제 구현 필요)
// ============================================
function handleEdit(user: User) {
  console.log('Edit user:', user);
}

function handleDelete(id: number) {
  console.log('Delete user:', id);
}

function handlePublish(id: number) {
  console.log('Publish post:', id);
}

function handleArchive(id: number) {
  console.log('Archive post:', id);
}

function handleRestore(id: number) {
  console.log('Restore post:', id);
}

async function updateUser(user: User) {
  // 실제 업데이트 로직
}

async function deleteUser(id: number) {
  // 실제 삭제 로직
}

