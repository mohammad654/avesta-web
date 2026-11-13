import type contactFormJson from '../../../../content/features/contact-form.json';
import type pipelineJson from '../../../../content/features/pipeline.json';
import type sampleReportUiJson from '../../../../content/features/sample-report.json';
import type standardsExplorerJson from '../../../../content/features/standards-explorer.json';

export type StandardsExplorerCopy = typeof standardsExplorerJson;
export type SampleReportCopy = typeof sampleReportUiJson;
export type PipelineCopy = typeof pipelineJson;
export type ContactFormCopy = typeof contactFormJson;

export interface FeatureCopy {
  standards: StandardsExplorerCopy;
  sampleReport: SampleReportCopy;
  pipeline: PipelineCopy;
  contactForm: ContactFormCopy;
}

export interface Snippets {
  githubAction: string;
}
