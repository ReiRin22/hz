import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../../../../test/stories/shared/patient-header/molecules/PatientAlertsMolecule.stories';

const { WithAllAlerts, AllergyOnly, InfectionOnly, HighRadiation, NoAlerts } = composeStories(stories);

describe('PatientAlertsMolecule', () => {
  // C0: 基本レンダリング
  test('WithAllAlerts: アレルギー・感染症・放射線バッジがすべて表示される', () => {
    render(<WithAllAlerts />);
    expect(screen.getByText('アレルギー')).toBeInTheDocument();
    expect(screen.getByText('感染症')).toBeInTheDocument();
    expect(screen.getByText(/放射線/)).toBeInTheDocument();
  });

  test('AllergyOnly: アレルギーのみ表示される', () => {
    render(<AllergyOnly />);
    expect(screen.getByText('アレルギー')).toBeInTheDocument();
    expect(screen.queryByText('感染症')).not.toBeInTheDocument();
  });

  test('InfectionOnly: 感染症のみ表示される', () => {
    render(<InfectionOnly />);
    expect(screen.queryByText('アレルギー')).not.toBeInTheDocument();
    expect(screen.getByText('感染症')).toBeInTheDocument();
  });

  test('HighRadiation: 放射線警告が表示される', () => {
    render(<HighRadiation />);
    expect(screen.getByText(/放射線/)).toBeInTheDocument();
  });

  // C1: 条件分岐（表示/非表示）
  test('NoAlerts: アラートが一切表示されない', () => {
    render(<NoAlerts />);
    expect(screen.queryByText('アレルギー')).not.toBeInTheDocument();
    expect(screen.queryByText('感染症')).not.toBeInTheDocument();
  });

  test('WithAllAlerts: アレルギー名が表示される', () => {
    render(<WithAllAlerts />);
    expect(screen.getByText(/ペニシリン/)).toBeInTheDocument();
  });

  test('InfectionOnly: 感染症名が表示される', () => {
    render(<InfectionOnly />);
    expect(screen.getByText(/MRSA/)).toBeInTheDocument();
  });
});
