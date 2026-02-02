# ----------------------------------------------------------------------------------------------------
# Terraform Provider 설정
# Terraform이 AWS와 상호작용하기 위해 필요한 설정을 정의합니다.
# ----------------------------------------------------------------------------------------------------

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # AWS Provider 버전을 5.0 이상으로 고정 (안정성을 위함)
    }
  }
}

# AWS Provider 구성
provider "aws" {
  region = var.aws_region # variables.tf에서 정의한 리전 변수 사용 (기본값: Seoul)
}
