import { describe, it, expect, beforeEach } from 'vitest';
import { useRightSideMenuStore } from '../stores/use-right-side-menu.store';

beforeEach(() => {
  useRightSideMenuStore.getState().reset();
});

describe('useRightSideMenuStore', () => {
  describe('初期状態', () => {
    it('isCollapsed が false', () => {
      expect(useRightSideMenuStore.getState().isCollapsed).toBe(false);
    });

    it('showBulletinDialog が false', () => {
      expect(useRightSideMenuStore.getState().showBulletinDialog).toBe(false);
    });

    it('showMemoDialog が false', () => {
      expect(useRightSideMenuStore.getState().showMemoDialog).toBe(false);
    });

    it('memoTab が received', () => {
      expect(useRightSideMenuStore.getState().memoTab).toBe('received');
    });

    it('items が空配列', () => {
      expect(useRightSideMenuStore.getState().items).toEqual([]);
    });

    it('menuFetchError が null', () => {
      expect(useRightSideMenuStore.getState().menuFetchError).toBeNull();
    });
  });

  describe('toggleCollapse', () => {
    it('false → true に切り替わる', () => {
      useRightSideMenuStore.getState().toggleCollapse();
      expect(useRightSideMenuStore.getState().isCollapsed).toBe(true);
    });

    it('true → false に切り替わる', () => {
      useRightSideMenuStore.getState().toggleCollapse();
      useRightSideMenuStore.getState().toggleCollapse();
      expect(useRightSideMenuStore.getState().isCollapsed).toBe(false);
    });
  });

  describe('院内掲示板ダイアログ', () => {
    it('openBulletinDialog で showBulletinDialog が true になる', () => {
      useRightSideMenuStore.getState().openBulletinDialog();
      expect(useRightSideMenuStore.getState().showBulletinDialog).toBe(true);
    });

    it('closeBulletinDialog で showBulletinDialog が false になる', () => {
      useRightSideMenuStore.getState().openBulletinDialog();
      useRightSideMenuStore.getState().closeBulletinDialog();
      expect(useRightSideMenuStore.getState().showBulletinDialog).toBe(false);
    });
  });

  describe('伝言メモダイアログ', () => {
    it('openMemoDialog で showMemoDialog が true になる', () => {
      useRightSideMenuStore.getState().openMemoDialog();
      expect(useRightSideMenuStore.getState().showMemoDialog).toBe(true);
    });

    it('closeMemoDialog で showMemoDialog が false に、selectedMemoId が null になる', () => {
      useRightSideMenuStore.getState().openMemoDialog();
      useRightSideMenuStore.getState().selectMemo('memo1');
      useRightSideMenuStore.getState().closeMemoDialog();
      expect(useRightSideMenuStore.getState().showMemoDialog).toBe(false);
      expect(useRightSideMenuStore.getState().selectedMemoId).toBeNull();
    });
  });

  describe('メモタブ', () => {
    it('setMemoTab で memoTab が変わる', () => {
      useRightSideMenuStore.getState().setMemoTab('sent');
      expect(useRightSideMenuStore.getState().memoTab).toBe('sent');
    });
  });

  describe('メモ選択', () => {
    it('selectMemo で selectedMemoId がセットされる', () => {
      useRightSideMenuStore.getState().selectMemo('memo1');
      expect(useRightSideMenuStore.getState().selectedMemoId).toBe('memo1');
    });

    it('clearSelectedMemo で selectedMemoId が null になる', () => {
      useRightSideMenuStore.getState().selectMemo('memo1');
      useRightSideMenuStore.getState().clearSelectedMemo();
      expect(useRightSideMenuStore.getState().selectedMemoId).toBeNull();
    });
  });

  describe('診療科選択', () => {
    it('toggleDepartment で診療科が追加される', () => {
      useRightSideMenuStore.getState().toggleDepartment('看護部');
      expect(useRightSideMenuStore.getState().selectedDepartments).toContain('看護部');
    });

    it('同じ診療科を再度 toggle すると削除される', () => {
      useRightSideMenuStore.getState().toggleDepartment('看護部');
      useRightSideMenuStore.getState().toggleDepartment('看護部');
      expect(useRightSideMenuStore.getState().selectedDepartments).not.toContain('看護部');
    });

    it('clearDepartments で selectedDepartments が空になる', () => {
      useRightSideMenuStore.getState().toggleDepartment('看護部');
      useRightSideMenuStore.getState().clearDepartments();
      expect(useRightSideMenuStore.getState().selectedDepartments).toHaveLength(0);
    });
  });

  describe('メモ確認', () => {
    it('confirmMemo で confirmedMemos に追加され selectedMemoId が null になる', () => {
      useRightSideMenuStore.getState().selectMemo('memo1');
      useRightSideMenuStore.getState().confirmMemo('memo1');
      expect(useRightSideMenuStore.getState().confirmedMemos['memo1']).toBe(true);
      expect(useRightSideMenuStore.getState().selectedMemoId).toBeNull();
    });
  });

  describe('reset', () => {
    it('全状態が初期値に戻る', () => {
      useRightSideMenuStore.getState().toggleCollapse();
      useRightSideMenuStore.getState().openBulletinDialog();
      useRightSideMenuStore.getState().toggleDepartment('看護部');
      useRightSideMenuStore.getState().reset();
      const state = useRightSideMenuStore.getState();
      expect(state.isCollapsed).toBe(false);
      expect(state.showBulletinDialog).toBe(false);
      expect(state.selectedDepartments).toHaveLength(0);
    });
  });
});
