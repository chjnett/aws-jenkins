# ----------------------------------------------------------------------------------------------------
# 변수 정의 (Variables)
# Terraform 코드 전반에서 재사용되는 값들을 한곳에서 관리합니다.
# terraform.tfvars 파일에서 이 값들을 덮어쓸 수 있습니다.
# ----------------------------------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS 리전 (배포할 위치)"
  default     = "ap-northeast-2" # 기본값: 서울 (Seoul) 리전
}

variable "project_name" {
  description = "프로젝트 이름 (리소스 이름의 접두사로 사용)"
  default     = "energy-truck"
}

variable "vpc_cidr" {
  description = "VPC의 네트워크 대역 (CIDR 블록)"
  default     = "10.0.0.0/16" # 10.0.0.0 ~ 10.0.255.255 범위의 IP 사용
}
